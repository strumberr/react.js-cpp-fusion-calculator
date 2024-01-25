#include <emscripten.h>
#include "tinyexpr.h"
#include <math.h>
#include <limits>
#include <cmath>
#include <iostream>

// short names for types
#define ALIVE EMSCRIPTEN_KEEPALIVE
#define ld double

#define DEFAULT_X0 0
#define DEFAULT_LAMBDA 0.01
#define DEFAULT_EPSILON 0.0001
#define DEFAULT_CHUNK_LIMIT 1000000

// global variables

ld x0 = DEFAULT_X0, x1 = DEFAULT_X0;
ld lambda = DEFAULT_LAMBDA;
ld epsilon = DEFAULT_EPSILON;
int chunk_limit = DEFAULT_CHUNK_LIMIT;

te_expr *f = NULL;
te_expr *df = NULL;

ld *history_x = NULL;
ld *history_y = NULL;
int history_size = 0;
int stopped = 0;

char *error_message = NULL;

// emscripten interface
extern "C" {
  ALIVE void init(char *f_str, char *df_str, ld x, ld l, ld e, int c);
  ALIVE ld generate_next_chunk(int c);

  ALIVE ld *get_history_x();
  ALIVE ld *get_history_y();
  ALIVE int get_history_size();
  ALIVE int get_if_stopped();
  ALIVE char *get_error_message();
}

void set_fx(char *f_str) {
  if(f != NULL) te_free(f);
  int error;
  te_variable var[] = {{"x", &x1}};
  f = te_compile(f_str, var, 1, &error);
  if (error) {
    error_message = (char *) "Error compiling f(x) expression";
    printf("error_message: %s\n", error_message);
  }
}

void set_dfx(char *df_str) {
  if(df != NULL) te_free(df);
  int error;
  te_variable var[] = {{"x", &x1}};
  df = te_compile(df_str, var, 1, &error);
  if (error) {
    error_message = (char *) "Error compiling df(x) expression";
    printf("error_message: %s\n", error_message);
  }
}

void set_history(int size) {
  if(history_x != NULL) free(history_x);
  if(history_y != NULL) free(history_y);

  history_x = (ld *) malloc(size * sizeof(ld));
  history_y = (ld *) malloc(size * sizeof(ld));
  history_size = size;
}

// functions to retrieve calculated data
ALIVE ld *get_history_x() {return history_x;}
ALIVE ld *get_history_y() {return history_y;}
ALIVE int get_history_size() {return history_size;}
ALIVE int get_if_stopped() {return stopped;}
ALIVE char *get_error_message() {return error_message;}

// main function
ALIVE void init(char *f_str, char *df_str, ld x, ld l, ld e, int c) {
  error_message = NULL;
  set_fx(f_str);
  set_dfx(df_str);
  x0 = x1 = x;
  lambda = l;
  epsilon = e;
  chunk_limit = c;
  stopped = 0;
  set_history(1);
  history_x[0] = x1;
  history_y[0] = te_eval(f);
}

ALIVE ld generate_next_chunk(int c) {
  if(f == NULL) {
    error_message = (char *) "f(x) expression not set";
    printf("error_message: %s\n", error_message);
    return 0;
  }
  
  if(df == NULL) {
    error_message = (char *) "df(x) expression not set";
    printf("error_message: %s\n", error_message);
    return 0;
  }

  if (c > chunk_limit) {
    error_message = (char *) "Chunk size exceeds limit of 1000";
    printf("error_message: %s\n", error_message);
    return 0;
  }

  set_history(c);
  
  int last_history = 0;

  for(int i = 0; i < c; i++) {
    x1 = x0 - lambda * te_eval(f);

    if(std::isinf(x1)) {
      error_message = (char *) "limit of long ld exceeded";
      printf("error_message: %s\n", error_message);
      return 0;
    }

    if(std::isnan(x1)) {
      error_message = (char *) "can't process f(x)";
      printf("error_message: %s\n", error_message);
      return 0;
    }

    history_x[i] = x1;
    history_y[i] = te_eval(f);

    printf("%f", te_eval(f));
    last_history++;
    
    if(std::fabs(x1 - x0) < epsilon){
      stopped = 1;
      break;
    }
    x0 = x1;
  }

  x0 = x1;

  for (int i = last_history; i < c; i++) {
    history_x[i] = history_x[i - 1];
    history_y[i] = history_y[i - 1];
  }

  return x0;
}
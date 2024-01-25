# src/square.mjs: src/square.c
# 	emcc --no-entry src/square.c -o src/square.mjs  \
# 		-s ENVIRONMENT='web'  \
# 		-s SINGLE_FILE=1  \
# 		-s EXPORT_NAME='createModule'  \
# 		-s USE_ES6_IMPORT_META=0  \
# 		-s EXPORTED_FUNCTIONS='["_square", "_malloc", "_free"]'  \
# 		-s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
# 		-O3

src/dist/gradient.mjs: cpp/gradient.cpp
	emcc cpp/gradient.cpp cpp/tinyexpr.c -o src/dist/gradient.mjs \
		-s ENVIRONMENT='web' \
		-s SINGLE_FILE=1 \
		-s EXPORT_NAME='createGradientModule' \
		-s USE_ES6_IMPORT_META=0 \
		-I cpp \
		-s EXPORTED_FUNCTIONS='["_init", "_generate_next_chunk", "_get_history_x", "_get_history_y", "_get_history_size", "_get_error_message", "_get_if_stopped"]' \
		-s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' \
		-O3

src/square.mjs: src/square.c
	emcc --no-entry src/square.c -o src/square.mjs  \
		-s ENVIRONMENT='web'  \
		-s SINGLE_FILE=1  \
		-s EXPORT_NAME='createModule'  \
		-s USE_ES6_IMPORT_META=0  \
		-s EXPORTED_FUNCTIONS='["_square", "_malloc", "_free"]'  \
		-s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]'  \
		-O3

test:
	@./support/expresso/bin/expresso -I support

test-resource:
	@./support/expresso/bin/expresso -I support test/resource.test.js

test-singular:
	@./support/expresso/bin/expresso -I support test/singular.test.js

test-extra-routes:
	@./support/expresso/bin/expresso -I support test/extra-routes.test.js

.PHONY: test
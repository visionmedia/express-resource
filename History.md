
0.2.1 / 2011-05-25 
==================

  * Fixed for express 2.3.9. Closes #18
  * Added better support for mapping your own actions. Closes #7

0.2.0 / 2011-04-09 
==================

  * Added basic content-negotiation support via format extensions
  * Added nested resource support
  * Added auto-loading support, populating `req.user` etc automatically
  * Added another options param to `app.resource()`
  * Added `Resource#[http-verb]()` methods to define additional routes
  * Added `Resource#map(method, path, fn)`
  * Changed; every `Resource` has a `.base`
  * Changed; resource id is no longer "id", it's a singular version of the resource name, aka `req.params.user` etc

0.1.0 / 2011-03-27
==================

  * Added support for top-level resources [Daniel Gasienica]

0.0.2 / 2011-03-03 
==================

  * Added Express 2.0 support

0.0.1 / 2010-09-06 
==================

  * Initial release

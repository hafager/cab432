/* Simple function to sync up code with Generators.
 * Browser support for generators is poor, and Nodejs doesn't have them.
 * So use iojs!
 * Adapted from: http://blog.carbonfive.com/2013/12/01/hanging-up-on-callbacks-generators-in-ecmascript-6/
 */

 module.exports = sync;

 function sync(gen) {
 	var iterable = gen(resume);
 	iterable.next();
 	function resume(err, retVal) {
 		setImmediate(function() {
      if (err) iterable.throw(err); // raise!
      iterable.next(retVal);
  });
 	}
 }
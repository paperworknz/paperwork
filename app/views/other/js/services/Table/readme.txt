-	map is stored in the user's localStorage
-	it's an object with a filter property (string of a filter name)
	and a columns object containing all of the columns it can find
	from the DOM. (ie. It reads the DOM to build the map)
-	the filter() method is exposed, allowing anything to filter the
	table. It takes a string which is the filter.
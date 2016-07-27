`The application works in the following way. An array of boxes is randomized and the HTML is generated based on it. When a box is clicked, the values are added to the check array. 

If the values are equal, they are added to the pairs array while at the same time are removed from the boxes array. This solves the many bugs that happen with double-clicks, multiple pushes etc...

The process is repeated until there are no more boxes i.e. they are now in the pairs array, and the game finishes. The score is then presented.

The flipping (opening/closing) of the boxes is done by manipulating the classes of the box divs.
`
// Main action when a box is clicked. It places the box in a temporary check array in order to be, well... checked. Then, the actual checking is done.

$(document).ready(function () {

	$(document).on('click', '.box', function () {
		$(this).removeClass("closed").addClass("open");
		// Adds the value of the box, AS WELL as the id. This is used to prevent double clicking i.e. selecting the same box.
		check.push([parseInt($(this).text()), $(this).attr('id')]);
		countClicks += 1;
		// We divide by 2 because it takes 2 clicks for an attempt.
		$("#clicks").html(Math.round(countClicks / 2));
		checkBoxes();
		checkScore();
	});

	///////////////// CHECKING /////////////////

	var countClicks = 0;
	var check = []; // Pair to be checked. Key component.
	var pairs = []; // Guessed pairs.

	// Adds the correctly guessed pairs to the pairs array while removing them from the boxes array.
	function checkBoxes() {
		var box1 = check[0][0];
		var box2 = check[1][0];
		// This is the main logic. Executes if the boxes are the same.
		if (check.length == 2) {
			// This is the tricky part which solves the problem when the same box is clicked twice. It is solved by using the ids as identification.
			if (box1 == box2 && check[0][1] != check[1][1]) {
				// Allows only one correct answer by checking if it was already submitted. 
				if (pairs.indexOf(box1) == -1) {
					pairs.push(box1, box2);
					// Removes the boxes i.e. sets them to 0. This prevents the closing of a correct pair if it is clicked in the combination with another number AFTER it has been guessed correctly.
					for (var i = 0; i < boxes.length; i++) {
						if (boxes[i] == box1) {
							boxes.splice(i, 1, 0);
						}
					}
					check = [];
				}
			} else { // If they are not the same, reset.
				// Time window to memorize the selection.
				setTimeout(closeCheckedBoxes, 300);
			}
		}
	}

	// Checks if the game is over.
	function checkScore() {
		if (pairs.length == boxes.length) {
			$("#score").html("You did it! It took you " + Math.round(countClicks / 2) + " attempts.");
		}
	}

	///////////////// FLIPPING /////////////////

	// Closes the boxes when the selected boxes dont match. This is where the SPLICE to 0 from checkBoxes() comes into play.
	function closeCheckedBoxes() {
		for (var i = 0; i < check.length; i++) {
			for (var j = 0; j < boxes.length; j++) {
				if (check[i][0] == boxes[j]) {
					$('#box' + j).removeClass("open").addClass("closed");
				}
			}
		}
		check = [];
	}

	// Closes all the boxes. Used on grid creation.
	function closeBoxes() {
		for (var i = 0; i < boxes.length; i++) {
			$('#box' + i).removeClass("open").addClass("closed");
		}
	}

	///////////////// CREATION /////////////////

	// Initializes the game.
	$("#createBtn").click(function () {
		countClicks = 0;
		$("#score").html("<p>Attempts: <span id='clicks'></span></p>");
		createBoxes();
		createGrid();
		// Leaves time to memorize all the boxes.
		setTimeout(closeBoxes, 1500);
	});

	var boxes = []; // All the boxes.

	// Populates the boxes array.
	function createBoxes() {
		boxes = [];
		check = [];
		pairs = [];
		var numBox = $("#numBox").val();
		for (var i = 1; i <= numBox; i++) {
			boxes.push(i);
			boxes.push(i);
		}
	}

	// Creates the box grid with the items from the boxes array.
	function createGrid() {
		$("#grid").html("");
		var x = shuffleArray(boxes);
		for (var i = 0; i < x.length; i++) {
			var box = "<div id='box" + i + "' class='box open'>" + x[i] + "</div>";
			$("#grid").append(box);
		}
	}

	// Randomizes the boxes array. Bolerplate Stack Overflow code. The only unoriginal piece of code.
	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(Math.random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}
})
$(document).ready(function () {
	// make code pretty
	//window.prettyPrint && prettyPrint();
	setTimeout(function () {
		$("#optgroup").multiselect({
			search: {
				left: '<input type="text" name="q" class="form-control" placeholder="Search..." />',
				right: '<input type="text" name="q" class="form-control" placeholder="Search..." />',
			},
			fireSearch: function (value) {
				return value.length > 3;
			}
		});

		$('#optgroup_leftAll').click(function () {
			//$('#optgroup_to optgroup[label="Admin Operations"]').remove();
			//$('#optgroup optgroup[label="Admin Operations"]').remove();
			$('#optgroup_to').append('<optgroup label="Admin Operations"><option value="Change-Password">Change Password</option></optgroup>');
		});
	}, 1000);
});


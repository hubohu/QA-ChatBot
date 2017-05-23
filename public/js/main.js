
window.chartColors = {
	red: 'rgb(255, 99, 132)',
	orange: 'rgb(255, 159, 64)',
	yellow: 'rgb(255, 205, 86)',
	green: 'rgb(75, 192, 192)',
	blue: 'rgb(54, 162, 235)',
	purple: 'rgb(153, 102, 255)',
	grey: 'rgb(231,233,237)'
};

var _UPLOAD_FILES = {
	front_view_img : null,
	left_view_img : null,
	bird_eye_view_img : null,
	bottom_side_img : null,
	product_label_img : null
};

var collectionIds = ['colFrontView_f9cbd2', 'colLeftView_a0b862', 'colBirdEyeView_7cd99f', 'colBottomView_dfc811', 'colProductLabel_424bf4'];

$(function () {

	// Setup the dnd listeners.
	$.each($('.drop_zone'), function (index, zone) {
		zone.addEventListener('dragover', handleDragOver, false);
		zone.addEventListener('drop', handleFileDrop, false);
	});

	// Setup file change listener.
	$.each($(':input[type=file]'), function (index, zone) {
		zone.addEventListener('change', handleFileSelect, false);
	});

});

function startCompare() {

	// Get the files from input, create new FormData.
	var files = new Array();
	for (var fileKey in _UPLOAD_FILES) {
		files.push(_UPLOAD_FILES[fileKey]);
	}
	var formData = new FormData();

	// Append the files to the formData.
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		if (file) {
			formData.append('imgs[]', file, file.name);
			var identifier = [file.size, file.name, file.type].join('-');
			formData.append(collectionIds[i], identifier);
		} else {
			alert('Please add all view images.');
			return false;
		}
	}

	if (!$('#model').val()) {
		alert('Please enter Product Model.');
		return false;
	}
	formData.append('model', $('#model').val());

	// Note: We are only appending the file inputs to the FormData.
	compareImgs(formData);	
}

function loadTestImgs() {

	var viewList = ['front_view', 'left_view', 'bird_eye_view', 'bottom_side', 'product_label'];

	$.each(viewList, function(index, view) {

		var imageId = view + '_img';
		var testImgPath = '/imgs/test/' + view + '.jpg'; 

		$('#' + imageId).attr('src', testImgPath);
	});

	$('#model').val('TEST001');
}


function clearAllImgs() {

	_UPLOAD_FILES = {
		front_view_img : null,
		left_view_img : null,
		bird_eye_view_img : null,
		bottom_side_img : null,
		product_label_img : null
	};

	var viewList = ['front_view', 'left_view', 'bird_eye_view', 'bottom_side', 'product_label'];

	$.each(viewList, function(index, view) {

		var imageId = view + '_img';
		$('#' + imageId).attr('src', '');
	});

	$('#model').val('TEST001');

}


function handleFileSelect(evt) {

	var targetId = evt.currentTarget.id;
	var imageId = targetId.replace('_input', '_img');
	var file = evt.target.files[0];

	_UPLOAD_FILES[imageId] = file;

	var tmppath = URL.createObjectURL(file);
	$('#' + imageId).attr('src', tmppath);

}

function handleFileDrop(evt) {

	evt.stopPropagation();
	evt.preventDefault();

	var targetId = evt.currentTarget.id;
	var imageId = targetId + '_img';

	var files = evt.dataTransfer.files; // FileList object.

	// files is a FileList of File objects. List some properties.
	if (files && files[0]) {
		var file = files[0]
		// Only process image files.
		if (!file.type.match('image.*')) {
			alert('Please drag a image file here.');
		} else {
			var reader = new FileReader();

			reader.onload = function (e) {
				$('#' + imageId).attr('src', e.target.result);
			}

			reader.readAsDataURL(file);
			_UPLOAD_FILES[imageId] = file;
		}
	}

}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// round decimal to a determined precision
function roundDecimal(num, precision) {
    return Number(+(Math.round(num + "e+" + precision)  + "e-" + precision)).toFixed(precision);;
}

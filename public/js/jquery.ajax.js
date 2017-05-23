/**
 * Upload the photos using ajax request.
 *
 * @param formData
 */
function compareImgs(formData) {

    $.ajax({
        url: '/compare_similarity',
        method: 'post',
        data: formData,
		tryCount : 0,
    	retryLimit : 0,
        processData: false,
        contentType: false,
        xhr: function () {
            var xhr = new XMLHttpRequest();
            return xhr;
        }
    }).done(handleSuccess).fail(function (xhr, status) {
        alert(status);
    });
}


/**
 * Handle the upload response data from server and display them.
 *
 * @param data
 */
function handleSuccess(serverResponse) {

    if (serverResponse) {
 
		var data = {
			labels: ["front view", "left view", "bird's-eye view", "bottom side", "product label"],
			datasets: [
				{
					label: 'Similarity(0 - 1) of [' + $('#model').val() + ']',
					backgroundColor: "#4CAF50",
					borderColor: "#4CAF50",
					pointBackgroundColor: "gray",
					pointBorderColor: "#fff",
					pointHoverBackgroundColor: "#fff",
					pointHoverBorderColor: "gray",
					data: serverResponse.result
				}
			]
		};

		var config = {
			type: 'radar',
			data: data,
			options: {
				responsive: true,
				scale: {
					ticks: {
						min: 0,
						max: 1,
						stepSize : 0.2
					}
				}
			}
		};

		var radar_ctx = document.getElementById('radar-chart').getContext('2d');
		window.radar = new Chart(radar_ctx, config);


		var realRate = caculateRate(serverResponse.result);

		var doughnut_ctx = document.getElementById('doughnut-chart').getContext('2d');
		var data = {
			labels: [
				"Real",
				"Fake"
			],
			datasets: [
				{
					data: [realRate, 100 - realRate],
					backgroundColor: [
						"#4CAF50",
						"lightgray"
					]
				}]
		};
		// And for a doughnut chart
		var myDoughnutChart = new Chart(doughnut_ctx, {
			type: 'doughnut',
			data: data,
			options: {}
		});

    } else {
        alert('No images were compared.')
    }
}

function caculateRate(result) {
	var weightedRst = result[0] * 1.0 + result[1] * 1.0 + result[2] * 1.0 + result[3] * 1.0 + result[4] * 2.0;
	return roundDecimal((weightedRst/6.0) * 100.0, 2);
}
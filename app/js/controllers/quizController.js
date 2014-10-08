
ngQuizApp.controller("ngQuizController", function($scope, $http, $sce){
	
	$scope.questionInProgress = 0;
	$scope.uploadForm = {'ext': null};
	$http({
		'method': 'GET',
		'url' : 'config/AllQuestionTypes.json'
	})
	//.success(function(data) { $scope.config= data; window.config= $scope.config; })
	.success(function(data) { 
			$scope.config= data; 
			$scope.unsafeHtml();
			window.config= $scope.config; 
		})
	.error(function(data) { console.error('Config Load Error'); });
		
	$scope.nextQuestion = function nextQuestion() {
		//$scope.$apply(function(){  });
		$scope.questionInProgress++;
		$scope.unsafeHtml();		
	};
	
	$scope.prevQuestion = function prevQuestion() {
		$scope.questionInProgress--;
		$scope.unsafeHtml();
	};
	
	$scope.unsafeHtml = function unsafeHtml(){
		if($scope.config['questionList'][$scope.questionInProgress]['Qtext']){$scope.trustedHtmlQText = $sce.trustAsHtml($scope.config['questionList'][$scope.questionInProgress]['Qtext'])}		
		//if($scope.config['questionList'][$scope.questionInProgress]['labels']){$scope.trustedHtmllabels = $sce.trustAsHtml($scope.config['questionList'][$scope.questionInProgress]['labels'])}
		//if($scope.config['questionList'][$scope.questionInProgress]['options']){$scope.trustedHtmloptions = $sce.trustAsHtml($scope.config['questionList'][$scope.questionInProgress]['options'])}
	} 
	
	$scope.ansSelect = function ansSelect(optionID) {
		var selectedOptionID = $scope.config['questionList'][$scope.questionInProgress]['selectedOptionID'],
			selectedChekboxes = $scope.config['questionList'][$scope.questionInProgress]['selectedOption']
		if(selectedOptionID || selectedOptionID === null)
			$scope.config['questionList'][$scope.questionInProgress]['selectedOptionID'] = optionID;
		else if(selectedChekboxes)
			$scope.config['questionList'][$scope.questionInProgress]['selectedOption'][optionID] = true;
	};
	
	$scope.getURL = function getURL(type) {
		if(type) {
			return 'views/'+ type + '.html';
		} else {
			return '';
		}
	};
	
	$scope.submit = function submit() {
		alert('');
	};
	
	$scope.validateUpload = function validateUpload() {
		var ext = $scope.uploadForm.ext.name.split('.')[1];
		if($scope.config['questionList'][$scope.questionInProgress]['acceptableExtensions'].indexOf(ext) == -1) {
		    alert('invalid extension!');
		} else {
			$http({
				'method': 'POST',
				'url' : '/a.php',
				'data': { 'file': $scope.uploadForm.ext}
			})
			.success(function(data) { console.log('File submitted');   })
			.error(function(data) { console.error('File Submit Error'); });
		}
	};
});
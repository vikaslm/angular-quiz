/*! Angular-PDF Version: 0.3.3 | (C) Sayanee Basu 2014, released under an MIT license */
	!function(){
		"use strict";
		angular.module("pdf",[]).directive("ngPdf",function($window){
			return{restrict:"E",templateUrl:function(element,attr){
				return attr.templateUrl?attr.templateUrl:"partials/viewer.html"
			},link:function(scope,element,attrs){
				var url=scope.pdfUrl,
				pdfDoc=null,
				pageNum=1,
				scale=attrs.scale?attrs.scale:1,
				canvas=document.getElementById(attrs.canvasid?attrs.canvasid:"pdf-canvas"),
				ctx=canvas.getContext("2d"),
				windowEl=angular.element($window);
				windowEl.on("scroll",function(){
					scope.$apply(function(){scope.scroll=windowEl[0].scrollY})
				}),
				PDFJS.disableWorker=!0,
				scope.pageNum=pageNum,
				scope.renderPage=function(num){
					pdfDoc.getPage(num).then(function(page){
							var viewport=page.getViewport(scale),renderContext={};
							canvas.height=viewport.height,
							canvas.width=viewport.width,
							renderContext={canvasContext:ctx,viewport:viewport},
							page.render(renderContext)
						}
					)
				},
				scope.goPrevious=function(){
					scope.pageToDisplay<=1||(scope.pageToDisplay=scope.pageToDisplay-1,scope.renderPage(scope.pageToDisplay))
				},
				scope.goNext=function(){
					scope.pageToDisplay>=pdfDoc.numPages||(scope.pageToDisplay=scope.pageToDisplay+1,scope.renderPage(scope.pageToDisplay))
				},
				scope.zoomIn=function(){
					return scale=parseFloat(scale)+.2,
					scope.renderPage(scope.pageToDisplay),scale
				},
				scope.zoomOut=function(){
					return scale=parseFloat(scale)-.2,scope.renderPage(scope.pageToDisplay),scale
				},
				scope.changePage=function(){
					scope.renderPage(scope.pageToDisplay)
				},
				scope.rotate=function(){
					"rotate0"===canvas.getAttribute("class")?canvas.setAttribute("class","rotate90"):"rotate90"===canvas.getAttribute("class")?canvas.setAttribute("class","rotate180"):"rotate180"===canvas.getAttribute("class")?canvas.setAttribute("class","rotate270"):canvas.setAttribute("class","rotate0")
				},
				PDFJS.getDocument(url).then(function(_pdfDoc){
					pdfDoc=_pdfDoc,
					scope.renderPage(scope.pageToDisplay),
					scope.$apply(function(){
						scope.pageCount=_pdfDoc.numPages
					})
				}),
				scope.$watch("pageNum",function(newVal){
					scope.pageToDisplay=parseInt(newVal),null!==pdfDoc&&scope.renderPage(scope.pageToDisplay)
				})
			}}
		})
	}();
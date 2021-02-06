﻿export function init(key, elementId, dotnetRef, backgroundColor, controlSize) {
	if (!key || !elementId || !dotnetRef) {
		return;
	}

	storeElementIdWithDotnetRef(_mapsElementDict, elementId, dotnetRef, backgroundColor, controlSize); //Store map info

	let scriptsIncluded = false;
	let scriptTags = document.querySelectorAll('head > script');
	scriptTags.forEach(scriptTag => {
		if (scriptTag.getAttribute('src').startsWith("https://maps.googleapis.com/maps/api/js?key=")) {
			scriptsIncluded = true;
			return;
		}
	});

	if (scriptsIncluded) { //Prevent adding JS scripts to page multiple times.
		return;
	}

	//Inject required Google JS scripts to HTML (only once!)
	let importedPoly = document.createElement('script');
	importedPoly.src = "https://polyfill.io/v3/polyfill.min.js?features=default";
	document.head.appendChild(importedPoly);

	let src = "https://maps.googleapis.com/maps/api/js?key=" + key + "&callback=initGoogleMaps&libraries=&v=weekly";
	let importedMaps = document.createElement('script');
	importedMaps.src = src;
	importedMaps.defer = true;
	document.head.appendChild(importedMaps);
}

//Global function for Google Js callback. It will be called when "https://maps.googleapis.com/maps/api/js" loaded.
//TODO: multiple instances of Js Maps if registered must be stored before callback happens. In the future it might causes timing issues...
window.initGoogleMaps = () => {
	for (let i = 0; i < _mapsElementDict.length; i++) {
		let elementId = _mapsElementDict[i].key;
		let mapInfo = _mapsElementDict[i].value;

		//Create Map
		let map = new google.maps.Map(document.getElementById(elementId), {
			backgroundColor: mapInfo.bgColor,
			controlSize: mapInfo.ctrSize,
		});
		map.elementId = elementId;
		_mapsElementDict[i].value.map = map;

		function mouseEventHandlers(mapsMouseEvent, callbackFuncName) {
			if (map && map.elementId && mapsMouseEvent) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					let coord = mapsMouseEvent.latLng.toJSON();
					let arg = {
						Latitude: coord.lat,
						Longitude: coord.lng
					};

					mapWithDotnetRef.ref.invokeMethodAsync(callbackFuncName, arg);
				}
			}
		}

		//Add Event listeners
		//Mouse
		map.addListener("click", (mapsMouseEvent) => {
			mouseEventHandlers(mapsMouseEvent, "MapClicked");
		});
		map.addListener("dblclick", (mapsMouseEvent) => {
			mouseEventHandlers(mapsMouseEvent, "MapDoubleClicked");
		});
		map.addListener("contextmenu", (mapsMouseEvent) => {
			mouseEventHandlers(mapsMouseEvent, "MapContextMenu");
		});
		map.addListener("mouseup", (mapsMouseEvent) => {
			mouseEventHandlers(mapsMouseEvent, "MapMouseUp");
		});
		map.addListener("mousedown", (mapsMouseEvent) => {
			mouseEventHandlers(mapsMouseEvent, "MapMouseDown");
		});
		map.addListener("mousemove", (mapsMouseEvent) => {
			mouseEventHandlers(mapsMouseEvent, "MapMouseMove");
		});
		map.addListener("mouseover", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapMouseOver");
				}
			}
		});
		map.addListener("mouseout", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapMouseOut");
				}
			}
		});
		//Changes
		map.addListener("center_changed", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef && map.getCenter()) {
					let center = map.getCenter().toJSON();
					let arg = {
						Latitude: center.lat,
						Longitude: center.lng
					};

					mapWithDotnetRef.ref.invokeMethodAsync("MapCenterChanged", arg);
				}
			}
		});
		map.addListener("zoom_changed", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapZoomChanged", map.getZoom());
				}
			}
		});
		map.addListener("maptypeid_changed", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapTypeIdChanged", map.getMapTypeId());
				}
			}
		});
		map.addListener("heading_changed", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapHeadingChanged", map.getHeading());
				}
			}
		});
		map.addListener("tilt_changed", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapTiltChanged", map.getTilt());
				}
			}
		});
		map.addListener("bounds_changed", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapBoundsChanged");
				}
			}
		});
		map.addListener("projection_changed", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapProjectionChanged");
				}
			}
		});
		map.addListener("draggable_changed", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapDraggableChanged");
				}
			}
		});
		map.addListener("streetview_changed", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapStreetviewChanged");
				}
			}
		});
		//Drag
		map.addListener("drag", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef && map.getCenter()) {
					let center = map.getCenter().toJSON();
					let arg = {
						Latitude: center.lat,
						Longitude: center.lng
					};

					mapWithDotnetRef.ref.invokeMethodAsync("MapDrag", arg);
				}
			}
		});
		map.addListener("dragend", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef && map.getCenter()) {
					let center = map.getCenter().toJSON();
					let arg = {
						Latitude: center.lat,
						Longitude: center.lng
					};

					mapWithDotnetRef.ref.invokeMethodAsync("MapDragEnd", arg);
				}
			}
		});
		map.addListener("dragstart", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef && map.getCenter()) {
					let center = map.getCenter().toJSON();
					let arg = {
						Latitude: center.lat,
						Longitude: center.lng
					};

					mapWithDotnetRef.ref.invokeMethodAsync("MapDragStart", arg);
				}
			}
		});
		//Other
		map.addListener("resize", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					let arg = {
						Width: map.getDiv().offsetWidth,
						Height: map.getDiv().offsetHeight
					};
					mapWithDotnetRef.ref.invokeMethodAsync("MapResized", arg);
				}
			}
		});
		map.addListener("tilesloaded", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapTilesLoaded");
				}
			}
		});
		map.addListener("idle", () => {
			if (map && map.elementId) {
				let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, map.elementId);
				if (mapWithDotnetRef) {
					mapWithDotnetRef.ref.invokeMethodAsync("MapIdle");
				}
			}
		});
		//Init
		_mapsElementDict[i].value.ref.invokeMethodAsync("MapInitialized", elementId);
	}
};

//Store elementId with .NET Ref
function storeElementIdWithDotnetRef(dict, elementId, dotnetRef, backgroundColor, controlSize) {
	let elementFound = false;
	for (let i = 0; i < dict.length; i++) {
		if (dict[i].key === elementId) {
			return; //Element has been stored already
		}
	}

	if (!elementFound) {
		dict.push({
			key: elementId,
			value: { ref: dotnetRef, map: null, bgColor: backgroundColor, ctrSize: controlSize }
		});
	}
}
//Remove elementId with data
function removeElementIdWithDotnetRef(dict, elementId) {
	for (let i = 0; i < dict.length; i++) {
		if (dict[i].key === elementId) {
			dict.splice(i, 1);
			break;
		}
	}
}
//Return elementId with data
function getElementIdWithDotnetRef(dict, elementId) {
	for (let i = 0; i < dict.length; i++) {
		if (dict[i].key === elementId) {
			return dict[i].value;
		}
	}
}

let _mapsElementDict = [];
let _mapsMarkersDict = [];

//Google JS Maps Features
export function setCenterCoords(elementId, latitude, longitude) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {
			mapWithDotnetRef.map.setCenter({ lat: latitude, lng: longitude });
		}
	}
}
export function setCenterAddress(elementId, address) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {
			geocodeAddress(address, function (results) {
				if (results) {
					mapWithDotnetRef.map.setCenter(results[0].geometry.location);
				}
			});
		}
	}
}
export function panToCoords(elementId, latitude, longitude) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {
			mapWithDotnetRef.map.panTo({ lat: latitude, lng: longitude });
		}
	}
}
export function panToAddress(elementId, address) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {
			geocodeAddress(address, function (results) {
				if (results) {
					mapWithDotnetRef.map.panTo(results[0].geometry.location);
				}
			});
		}
	}
}
//set methods
export function setZoom(elementId, zoom) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {
			mapWithDotnetRef.map.setZoom(zoom);
		}
	}
}
export function setMapType(elementId, mapType) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {
			mapWithDotnetRef.map.setMapTypeId(mapType);
		}
	}
}
export function setHeading(elementId, heading) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {
			mapWithDotnetRef.map.setHeading(heading);
		}
	}
}
export function setTilt(elementId, tilt) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {
			mapWithDotnetRef.map.setTilt(tilt);
		}
	}
}
export function setClickableIcons(elementId, isClickable) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {
			mapWithDotnetRef.map.setClickableIcons(isClickable);
		}
	}
}
//generic set
export function setOptions(elementId, options) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {
			mapWithDotnetRef.map.setOptions(options);
		}
	}
}

export function resizeMap(elementId) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {
			google.maps.event.trigger(mapWithDotnetRef.map, "resize");
		}
	}
}

//Custom controls
export function createCustomControls(elementId, customControls) {
	if (elementId && customControls) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {

			for (var i = 0; i < customControls.length; i++) {
				let control = customControls[i];
				let controlDiv = document.createElement("div");
				controlDiv.innerHTML = control.content;

				mapWithDotnetRef.map.controls[control.controlPosition].push(controlDiv);

				let id = control.id;
				let dotnetRef = mapWithDotnetRef.ref;
				controlDiv.addEventListener("click", () => {
					dotnetRef.invokeMethodAsync("CustomControlClicked", id);
				});
			}
		}
	}
}

//Markers
export function createMarkers(elementId, markers) {
	if (elementId && markers) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		if (mapWithDotnetRef && mapWithDotnetRef.map) {

			for (var i = 0; i < markers.length; i++) {

				let markerData = markers[i];
				let marker = new google.maps.Marker({
					//required
					position: { lat: markerData.position.latitude, lng: markerData.position.longitude },
					map: mapWithDotnetRef.map,
					//optional
					anchorPoint: markerData.anchorPoint ? { x: markerData.anchorPoint.x, y: markerData.anchorPoint.y } : null,
					animation: markerData.animation,
					clickable: markerData.clickable,
					crossOnDrag: markerData.crossOnDrag,
					cursor: markerData.cursor,
					draggable: markerData.draggable,
					icon: markerData.icon,
					label: markerData.label,
					opacity: markerData.opacity,
					optimized: markerData.optimized,
					shape: markerData.shape,
					title: markerData.title,
					visible: markerData.visible,
					zIndex: markerData.zIndex,
				});

				//Marker events
				if (markerData.clickable) {
					//Create infoWindow
					let infoWindow = null;
					if (markerData.infoWindow) {
						infoWindow = new google.maps.InfoWindow({
							content: "",
						}); 
					}

					marker.addListener("click", () => {
						mapWithDotnetRef.ref.invokeMethodAsync("MarkerClicked", markerData.id);

						//If marker has info window
						if (infoWindow) {
							infoWindow.open(mapWithDotnetRef.map, marker);
						}
					});
				}

				if (markerData.draggable) {
					marker.addListener("drag", () => {
						markerDragEvents("MarkerDrag", markerData.id, marker.getPosition().toJSON());
					});

					marker.addListener("dragend", () => {
						markerDragEvents("MarkerDragEnd", markerData.id, marker.getPosition().toJSON());
					});

					marker.addListener("dragstart", () => {
						markerDragEvents("MarkerDragStart", markerData.id, marker.getPosition().toJSON());
					});

					function markerDragEvents(callBackName, id, pos) {
						let arg = {
							Latitude: pos.lat,
							Longitude: pos.lng
						};
						mapWithDotnetRef.ref.invokeMethodAsync(callBackName, id, arg);
					}
				}
			}
		}
	}
}

//Google GeoCoder
export function getAddressCoordinates(elementId, address) {
	geocodeAddress(address, function (results) {
		if (results) {
			let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
			if (mapWithDotnetRef && mapWithDotnetRef.map) {
				//TODO: map .NET object
				mapWithDotnetRef.ref.invokeMethodAsync("AddressSearch", results);
			}
		}
	});
}
function geocodeAddress(address, successCallback) {
	let geocoder = new google.maps.Geocoder();
	geocoder.geocode({
		'address': address
	}, function (results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			successCallback(results);
		}
	});
}

//Dispose
export function dispose(elementId) {
	if (elementId) {
		let mapWithDotnetRef = getElementIdWithDotnetRef(_mapsElementDict, elementId);
		mapWithDotnetRef.map = null;
		mapWithDotnetRef.ref = null;

		removeElementIdWithDotnetRef(elementId);
	}
}
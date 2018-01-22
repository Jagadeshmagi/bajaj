// import stripDiacritics from './stripDiacritics';
//
// function filterOptions (options, filterValue, excludeOptions, props) {
// 	console.log("I BREAK HERE> WHATS GOING ON???? options:", options, "filterValue", filterValue, "++++++++++++++++", excludeOptions, props)
// 	if (props.ignoreAccents) {
// 		if(filterValue){
// 			filterValue = stripDiacritics(filterValue);
// 		}
// 		// else if (!filterValue) {
// 		// 	filterValue = 'a'
// 		// 	// || stripDiacritics(options[0].label.slice(0,0));
// 		// }
// 	}
//
// 	if (props.ignoreCase) {
// 		if(filterValue){
// 			filterValue = filterValue.toLowerCase();
// 		}
// 		// else if (!filterValue) {
// 		// 	filterValue = 'a'
// 		// 	// || stripDiacritics(options[0].label.slice(0,0));
// 		// }
// 	}
//
// 	if (excludeOptions) excludeOptions = excludeOptions.map(i => i[props.valueKey]);
//
// 	return options.filter(option => {
// 		if (excludeOptions && excludeOptions.indexOf(option[props.valueKey]) > -1) return false;
// 		if (props.filterOption) return props.filterOption.call(this, option, filterValue);
// 		if (!filterValue) return true;
// 		var valueTest = String(option[props.valueKey]);
// 		var labelTest = String(option[props.labelKey]);
// 		if (props.ignoreAccents) {
// 			if (props.matchProp !== 'label') valueTest = stripDiacritics(valueTest);
// 			if (props.matchProp !== 'value') labelTest = stripDiacritics(labelTest);
// 		}
// 		if (props.ignoreCase) {
// 			if (props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
// 			if (props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
// 		}
// 		return props.matchPos === 'start' ? (
// 			(props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue) ||
// 			(props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue)
// 		) : (
// 			(props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0) ||
// 			(props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0)
// 		);
// 	});
// }
//
// module.exports = filterOptions;

import stripDiacritics from './stripDiacritics';

function filterOptions (options, filterValue, excludeOptions, props) {
	if (props.ignoreAccents) {
		filterValue = stripDiacritics(filterValue);
	}

	if (props.ignoreCase) {
		filterValue = filterValue.toLowerCase();
	}

	if (excludeOptions) {excludeOptions = excludeOptions.map(i => i[props.valueKey]);
		// console.log("excludeOptionsexcludeOptionsexcludeOptionsexcludeOptions", excludeOptions)
		;}
	// var options2 = [];
	// for (var i = 0; i < options.length; i++){
	// 	if(options[i].disabled === false) {
	// 		options.push(options[i])
	// 		console.log("options[i]options[i]", options[i])
	// 	}
	// }
	return options.filter(option => {
		if (excludeOptions && excludeOptions.indexOf(option[props.valueKey]) > -1) return false;
		if (props.filterOption) return props.filterOption.call(this, option, filterValue);
		if (!filterValue) return true;
		var valueTest = String(option[props.valueKey]);
		var labelTest = String(option[props.labelKey]);
		if (props.ignoreAccents) {
			if (props.matchProp !== 'label') valueTest = stripDiacritics(valueTest);
			if (props.matchProp !== 'value') labelTest = stripDiacritics(labelTest);
		}
		if (props.ignoreCase) {
			if (props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
			if (props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
		}
		if(option.disabled === false || option.inner === 'true') {
			return props.matchPos === 'start'? (
				(props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue) ||
				(props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue)
			) : (
				(props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0) ||
				(props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0)
			);
		} else {
			return "HELLOOOO"
		}
	});
}

module.exports = filterOptions;

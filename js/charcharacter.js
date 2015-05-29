		'use strict';
		var CharCharacter = (function() {
			var options = [{
					direction: 'forward',
					startTrigger: /f/, 
					preStopTrigger: /[ij\s,]/,
					boundaryTrigger: /[blh]/,
					stopTrigger: /[bd]/,
					baseClass: 'cc-lining-over'
				}, {
					direction: 'backward',
					startTrigger:  /[lh]/,
					preStopTrigger: /[hij\s,A-Z]/,
					boundaryTrigger: /[df]/,
					stopTrigger: /[bd]/,
					baseClass: 'cc-lining-over'
				}, {
					direction: 'forward',
					startTrigger: /q/, 
					preStopTrigger: /[\s,]/,
					boundaryTrigger: /p/,
					stopTrigger: /q/,
					baseClass: 'cc-lining-under'
				}, {
					direction: 'backward',
					startTrigger:  /[gyj]/,
					preStopTrigger: /[gyj\s]/,
					boundaryTrigger: /q/,
					stopTrigger: /[p]/,
					baseClass: 'cc-lining-under'
				} ];

			function lineScan(element, options) {
			if (options instanceof Array) {
				options.forEach(function(option) { lineScan(element, option)});
				return;
			}

			while(element) {
				if (options.startTrigger.exec(element.innerText)){
					actScan(element, options.direction === 'backward', options.preStopTrigger, options.boundaryTrigger, options.stopTrigger, options.baseClass);
				}
				element = element.nextSibling;
			}
		}

		function actScan(element, backward, preStop, boundaryStop, postStop, baseClass) {
			element.classList.add(baseClass + (backward?'-left':'-right'));
			while(element = backward?element.previousSibling:element.nextSibling) {
				if (preStop.exec(element.innerText)) {
					break;
				}
				if (boundaryStop.exec(element.innerText)) {
					if (!element.classList.contains(baseClass)){
						element.classList.add(baseClass + (backward?'-right':'-left'));
						break;
					}
				} else {
					element.classList.add(baseClass);
					element.classList.remove(baseClass + '-left');
					element.classList.remove(baseClass + '-right');
				}
				if (postStop.exec(element.innerText)) {
					break;
				}
			}
		}

		function lining(element) {	
			element.classList.add('cc-lining');
			var text = element.innerText;

			// wrap all characters by a span
			var fragment = document.createElement('span');
			fragment.innerHTML = text.replace(/./g, '<span>$&</span>');

			// convert spans
			lineScan(fragment.firstChild, options);

			// combine all equally classed spans
			var next = fragment.firstChild, el;
			while (el = next) {
				while ((next = el.nextSibling) && el.getAttribute('class') == next.getAttribute('class')){
					el.innerText = el.innerText + next.innerText;
					next.parentElement.removeChild(next);
				}
			}

			// set new content
			element.innerHTML = fragment.innerHTML;
		}

		return {lining: lining};

		})();

	// init with annotated elements
	window.addEventListener('load', function(e){
		[].slice.call(document.querySelectorAll(".belined")).forEach(function(element){
			CharCharacter.lining(element);
		});

		var input = document.getElementById('cc-belined-input');
		input.addEventListener('input', function(e){
            updateOutput();
		});

        function updateOutput(){
            var output = document.getElementById('cc-belined-output');
            output.innerText = input.value;
            output.style.fontSize = Math.min(1, Math.max(0.4, (6. / input.value.length))) + 'em';
            CharCharacter.lining(output);
        }

        updateOutput();
	});


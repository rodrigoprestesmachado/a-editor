/**
 * Copyright 2015, Rodrigo Prestes Machado
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * 		http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Polymer({
  	
  	is: "a-editor", 
  	
  	stylize: function(e){
  	
  		// Getting parameters
  		var args = e.target.getAttribute('data-args').split(',');
  		
  		var styleType = null;
  		if (styleType != "")
  			styleType = args[0];
  		
  		var styleValue = null;
  		if (args[1] == "this.value")
  			styleValue = e.target.value;
  		else
  			styleValue = args[1];
  	
  	
  		if ((styleType != null) && (styleValue != null)){
  			
  			 // Geting the node that represents the selection
		    var selection = document.getSelection();
		    var selectionText = selection.toString();
		    
		    // Checks whether there is a selected text
		    if (selectionText != "") {
		    
		        // Geting the HTML nodes
		        var range = selection.getRangeAt(0); 
		    
		    	var spanNode = this.retrieveSpanNode(range, selectionText);
		    
		    	// Checks whether the selected text has the span tag
		        if ((spanNode != null) && (spanNode.localName == "span")) {
		            
		            // Checking the size of the selected text is the same of the span text
		            if (selectionText.length === spanNode.childNodes[0].nodeValue.length){
					
						// Verifying that the span tag already has a style
						if (this.isStyle(spanNode, styleType)){
							// Remove
							this.applyStyle(spanNode, styleType, "");	
						}
						else{
							// Add
							this.applyStyle(spanNode, styleType, styleValue);
						}
					}
					else{
						
		                // Geting the text of the span (with some style)
		                var spanText = spanNode.childNodes[0].nodeValue;
		                
		                // Checking if style text is larger than the selection
		                if (selectionText.length < spanText.length){
		                    
		                    // Geting the entire tex insede the span 
		                    var text = selection.anchorNode.nodeValue;
		                    
		                    var start = text.substr(0, selection.anchorOffset);
		                    var middle = selectionText;
		                    var end = text.substr(selection.anchorOffset + selectionText.length, text.length);
		                   
		                    // First character issue
		                    if (start === middle){
		                    	start = "";
		                    	end = text.substr(1, end.length + 1);
		                    }
		                    
		                    // Geting the old CSS
		                   	var oldCss = spanNode.style.cssText;
		                    
		                    // Removing the entire span
		                    spanNode.parentNode.removeChild(spanNode);
		                    
		                    if (end != ""){
		                    	// Adding the node with style
			                    var endNode = document.createElement("span");
								endNode.appendChild(endNode.appendChild(document.createTextNode(end)));
			                    endNode.style.cssText = oldCss;
			                    range.insertNode(endNode);
		                    }
		                    
		                    if (middle != ""){
		                        // Verificando se o span já tem um estilo
								if (this.isStyle(spanNode, styleType)){
									// Remove
				                    // Adding the node without style
				                    var middleNode = document.createElement("span");
									middleNode.appendChild(middleNode.appendChild(document.createTextNode(middle)));
				                    middleNode.style.cssText = oldCss;
				                    this.applyStyle(middleNode, styleType, "");
				                    range.insertNode(middleNode);
								}
								else{
									// Add
				                    // Adding the node without style
				                    var middleNode = document.createElement("span");
									middleNode.appendChild(middleNode.appendChild(document.createTextNode(middle)));
				                    middleNode.style.cssText = oldCss;
				                    this.applyStyle(middleNode, styleType, styleValue);
				                    range.insertNode(middleNode);
								}
		                    }
		                    
		                    if (start != ""){
		                    	// Adding the node with style
		                    	var startNode = document.createElement("span");
								startNode.appendChild(startNode.appendChild(document.createTextNode(start)));
		                    	startNode.style.cssText = oldCss;
		                    	range.insertNode(startNode);
		                    }
		                }
		                else{
		                	//Invert style
		                    //TODO
		                    alert("Ok computer!");
		                }	
					}
		        }
		        else{
		        	
		            /** Adding first style with span **/
		            
		            // Deleting all contetens of the Range
		            range.deleteContents();
		           
		           	var selectionNode = this.createStyleNode(selectionText, styleType, styleValue);
		            
		            // Creating an empty node to put the cursor in the right place
		            var emptyNode = document.createTextNode("");
		        
		            // Inserting into the range
		            range.insertNode(emptyNode);
		            range.insertNode(selectionNode);
		        
		            // Ajusting the cursor in the right place
		            selection.extend(emptyNode, 0);
		        }
		        
		        this.clearEmptySpanTags();
		        
		    }
  			
  		}
  	   
	},
	
	
	createStyleNode:  function(text, styleType, styleValue) {
		var node = document.createElement("span");
		node.setAttribute("aria-describedby","styleAlert");
		node.setAttribute("class","aural");
		node.appendChild(node.appendChild(document.createTextNode(text)));
		return this.applyStyle(node, styleType, styleValue);
	},
	
	
	applyStyle: function(node, styleType, style) {
		
		if (styleType == "bold")
			node.style.fontWeight = style;
		else if (styleType == "italic")
			node.style.fontStyle = style;
		else if (styleType == "underline")
			node.style.textDecoration = style;
		else if (styleType == "font")
			node.style.fontFamily = style;	
		else if (styleType == "size")
			node.style.fontSize = style;	
		else if (styleType == "color")
			node.style.color = style;
			
		return node;
	},

	/**
	 * Verifies if span tag has a defined style
	 * 
	 * @param {Node} Onde node
	 * @param (String) One type of style
	 * @return {Boolean} True with the node has at least one style
	 */
	isStyle: function(node, styleType) {
		
		var result = false;
	
		if ((styleType === "bold") && (node.style.fontWeight === styleType ))
			result = true;
		
		if ((styleType === "italic") && (node.style.fontStyle === styleType ))
			result = true;
			
		if ((styleType === "underline") && (node.style.textDecoration === styleType ))
			result = true;	
			
		return result;
	},

	/**
	 * Method used to identify the type of browser
	 * 
	 * @return {String} One String with the browser name
	 **/
	browser: function(){
		var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		if(isOpera)
			return "opera";
			
	    if (typeof InstallTrigger !== 'undefined')
	    	return "firefox";
	    
		if (Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0)
			return "safari";
			
	    if (!!window.chrome && !isOpera)
	    	return "chrome";
	    	
		if (false || !!document.documentMode){
			return "ie";
		}
	},
	
	/**
	 * Method used to recover the span node. Each browser implement the
	 * Range API with different ways, so it was necessary to create this method to 
	 * deal with these differences.
	 * 
	 * @param {Node} Range object 
	 * @return {Node} Span element
	 **/
	retrieveSpanNode: function(range, selectionText){
		
	    var spanNode;
	    
		if ((range.commonAncestorContainer.nodeType == 3) && (range.endOffset >= 1))
			spanNode = range.commonAncestorContainer.parentNode;
		else
			spanNode = range.startContainer.nextElementSibling;
				
		return spanNode;
	    
	},
	
	/**
	 * Clear the span tags without content
	 **/
	clearEmptySpanTags: function(){
		var paperNode = document.getElementById("paper");
		
		for (var x in paperNode.childNodes){
			var node = paperNode.childNodes[x];
			if (node.localName == "span"){
				if(node.innerHTML == ""){
					paperNode.removeChild(node);
				}
			}
		}
		
	},
	
	/**
	 * Experimental
	 **/
	expe_paste: function(){
		if (event.dataTransfer){
			var text = event.dataTransfer.getData("Text");
			event.dataTransfer.setData("Text", text);
		}
	},
	
	/**
	 * Experimental
	 **/
	expe_fala: function(){
		var test = new SpeechSynthesisUtterance('Olá Rodrigo');
		test.lang = 'pt-br';
		window.speechSynthesis.speak(test);
	},
});
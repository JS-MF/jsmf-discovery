/**
 * @license
 * ©2015-2016 Luxembourg Institute of Science and Technology All Rights Reserved
 * JavaScript Modelling Framework (JSMF)
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 *
 * @author J.S. Sottet
 */
'use strict'

const _ = require('lodash')
const JSMF = require('jsmf-core')
const Class = JSMF.Class
const Model = JSMF.Model

/** Extracts a metamodel (class) from an specific (archetypal) instance
*  @param {String} name : Name of the new Class
*  @param {Object} element : the object either JSMF or other archetype of the system.
   @param metaElement {Class} (optional): a metaClass that can be updated according to the element
*/
function archetypalDiscovery(name,element, metaElement) {
    // The new created Class
    const result = Class.newInstance(name);
      _(element).toPairs()
                .map( x => {
                        let key = x[0]
                        let val = x[1];
                        //console.log(key, typeof(val))
                        switch(JSMFtypeof(val)) {
                            case 'string' :  
                                result.setAttribute(key,String);
                                break;
                            case 'number' :
                                result.setAttribute(key,Number); //warning boolean encoded by 0.1 are Number
                                break;
                            case 'boolean' :
                                result.setAttribute(key,Boolean); 
                                break;
                            case 'date' :
                                result.setAttribute(key,JSMF.Date);
                                break;
                            case 'singleReference' :
                                result.setReference('to'+val.conformsTo().__name,val.conformsTo(),-1)
                                break;
                            case 'anyReference' :
                                result.setReference('toAnyClass',JSMF.JSMFAny,-1)  
                                break;
                            case 'multipleReference':
                                result.setReference('to'+val[0].conformsTo().__name,val[0].conformsTo(),-1) 
                                break;
                            case 'undefined':
                                //console.log('undefined element');
                                break;
                            default :
                                console.log(JSMFtypeof(val),'undisclosed type')
                                break;
                        }
                })
                .value();
    
    if(JSMF.isJSMFClass(metaElement)) {
           updateClass(metaElement,result)
    }
    
    return result;
}

/**
   @param metaElement {Class} (optional): a metaClass that can be updated according to the element
*/
function updateClass(metaClass,newMetaClass) {
    metaClass.attributes = {}
    
    _(newMetaClass.attributes).each((x,y) => {
            metaClass.setAttribute(y,
                                   x.type,
                                   x.mandatory,
                                   x.errorCallback)
    })
    
    metaClass.references={}
    
     _(newMetaClass.references).each((x,y) => { console.log(x.type,x.cardinality)
            metaClass.addReference(y,
                                   x.type,
                                   x.cardinality,
                                   x.opposite,
                                   x.oppositeCardinality,
                                   x.associated,
                                   x.errorCallback,
                                   x.oppositeErrorCallback)
    })
    
}


/*----------------
Utility functions
------------------*/
/** Return if an array contains only a single type of JSMF elements
*   @param {Array} Arr : Array any elements
*/
function isArraySingleReference(arr) {
    if(_.every(arr,JSMF.isJSMFElement)) {
        const init = arr[0].conformsTo()
        return _(arr).map(x => x.conformsTo())
                .every(y => y===init)   
    } else return false;
}

/** Return a String that corresponds to the type of a value in parameter (including references targets)
* @param {Array} Arr : Array any elements
*/
function JSMFtypeof(val) {  
    var result = 'undefined';
     switch(typeof(val)) {
            case 'string' :  
                result ='string'
                break;
            case 'number' :
                result = 'number'
                break;
            case 'boolean' :
                result = 'boolean'
                break;
            case 'object' :
                //if is JSMFObject
                if(val instanceof Date) {
                 result = 'date'
                }
                if(JSMF.isJSMFElement(val)) {
                    result = 'singleReference'
                } else {
                    if(_.isArray(val)) { 
                        result = isArraySingleReference(val)?
                             'multipleReference'
                            : 'anyReference'
                    }
                }
                break; 
            case 'undefined':
                break;
            default :
                break;
        }

    return result;    
}

module.exports = {archetypalDiscovery, updateClass}
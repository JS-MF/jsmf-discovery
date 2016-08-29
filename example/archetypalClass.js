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
const discoverer = require('../index');
const JSMF = require('jsmf-core')
const Class = JSMF.Class
const Model = JSMF.Model
 
//TypeOf function
function CreateAnInstanceFromFlexibleClass() {
     
    const C1 = Class.newInstance('C1')
    const C2 = Class.newInstance('C2')
    const C3 = Class.newInstance('C3')
    C3.setAttribute('name',String)

    C1.setAttribute('name', String)
    C1.setAttribute('value', Number)
    C1.setAttribute('special',JSMF.Range(0,4))
    C1.setReference('toC2', C2, -1)

     const instanceofC1 = {name:'toto',value:10,special:2, url:'http'}
    
     instanceofC1.pick='z0212' 

     const ic2 = C2.newInstance();
     const instanceofC3 = C3.newInstance({name:'test'})
     const ic3b = C3.newInstance({name:'multiassociation'})
    
     instanceofC1.url2=instanceofC3
     instanceofC1.tab = [ic2,ic3b]

     var res = discoverer.archetypalDiscovery('C4',instanceofC1,C1)
      console.log(res);
}

function KenedyLady() {
    
const Person = Class.newInstance('Person', [],
  { firstname: {type: String, mandatory: true}
  , age: JSMF.Positive})


const Family = Class.newInstance('Family', [],
  { lastname: {type: String, mandatory: true}},
  { members: {target: Person, errorCallback: JSMF.onError.silent}})

const DomesticPet = JSMF.Class.newInstance('DomesticPet', [],
  { name: String
  , race: String})


Person.setFlexible(true)

const FamilyModel = new Model('FamilyModel', {}, [Family, Person])

const kennedy = Family.newInstance({name: 'Kennedy'})
const john = new Person({firstname: 'John', birthdate: new Date('1917-05-29')})
const jackie = Person.newInstance({firstname: 'Jacqueline', nickname: 'Jackie', birthdate: new Date('1929-07-28')})
const charlie = DomesticPet.newInstance({name:'Charlie', race: 'Welsh Terrier'})
kennedy.members = [john, jackie, charlie]

const Families = new Model('Families', FamilyModel, [kennedy, jackie, john, charlie])   

console.log(jackie);

const res = discoverer.archetypalDiscovery('Person',jackie,Person)
    console.log(res);
   // console.log('Before ', jackie.conformsTo().attributes)
  //  discoverer.updateClass(Person,res)
    console.log('After updated conformsTo ', jackie.conformsTo().attributes)
}

KenedyLady();
import test from 'node:test';
import assert from 'node:assert/strict';
import {intensity,spacing,distribution,sample} from '../physics.js';
const p={lambda:550,distance:.3,width:.05,length:1.5,mode:'double'};
test('central maximum, symmetry, and first interference minimum',()=>{assert.equal(intensity(0,p),1);assert.equal(intensity(.003,p),intensity(-.003,p));const s=p.lambda*1e-9/(2*p.distance*1e-3);const y=p.length*s/Math.sqrt(1-s*s);assert.ok(intensity(y,p)<1e-20);assert.ok(Math.abs(spacing(p)-.00275)<1e-10);});
test('path detection removes interference; single slit retains diffraction envelope',()=>{const y=spacing(p)/2;assert.ok(intensity(y,{...p,mode:'detector'})>.9);assert.equal(intensity(y,{...p,mode:'single'}),intensity(y,{...p,mode:'detector'}));const s=p.lambda*1e-9/(p.width*1e-3);assert.ok(intensity(p.length*s/Math.sqrt(1-s*s),{...p,mode:'single'})<1e-20);});
test('CDF remains normalized and samples valid bins across control ranges',()=>{for(const mode of ['double','single','detector','photon'])for(const lambda of [380,750]){const cdf=distribution({...p,mode,lambda});assert.ok(Math.abs(cdf.at(-1)-1)<1e-12);assert.ok(cdf.every((v,i)=>v>=0&&(i===0||v>=cdf[i-1])));for(const r of [0,.2,.5,.9,.99999])assert.ok(sample(cdf,r)>=0&&sample(cdf,r)<400);}});

export const sinc = x => Math.abs(x) < 1e-10 ? 1 : Math.sin(x) / x;
// Fraunhofer intensity: finite slit envelope, coherent or distinguishable paths.
export function intensity(y, {lambda, distance, width, length, mode}) {
  const sinTheta = y / Math.hypot(length, y);
  const envelope = sinc(Math.PI * width * 1e-3 * sinTheta / (lambda * 1e-9)) ** 2;
  return envelope * (mode === 'single' || mode === 'detector' ? 1 : Math.cos(Math.PI * distance * 1e-3 * sinTheta / (lambda * 1e-9)) ** 2);
}
export function spacing(p) { return p.lambda * 1e-9 * p.length / (p.distance * 1e-3); }
export function distribution(p, bins = 400) {
  const weights = Array.from({length:bins}, (_,i) => intensity(((i+.5)/bins-.5)*.04,p));
  const total=weights.reduce((a,b)=>a+b,0); let sum=0;
  return weights.map(w => (sum+=w/total));
}
export function sample(cdf, r=Math.random()) { let lo=0,hi=cdf.length-1; while(lo<hi){const mid=(lo+hi)>>1;if(cdf[mid]<r)lo=mid+1;else hi=mid;}return lo; }

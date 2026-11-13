const stage = document.querySelector('article');
const canvas = stage.querySelector('canvas');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const photo = new Image();
photo.src = new URL('./city.jpg', import.meta.url).href;

document.querySelector('#art').setAttribute('href',photo.src);

// Only the moving cloth is rendered on the canvas. The photograph underneath
// stays registered with the SVG lights from the first frame to the last.
function curtainRenderer() {
  const gl = canvas.getContext('webgl', {alpha:true, antialias:false, depth:false});
  if (!gl) return null;
  const program = gl.createProgram();
  function attach(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error(gl.getShaderInfoLog(shader));
    gl.attachShader(program, shader);
  }
  attach(gl.VERTEX_SHADER, `
    attribute vec2 position;
    varying vec2 uv;
    void main() {
      uv = vec2(.5+.5*position.x,.5-.5*position.y);
      gl_Position = vec4(position,0.,1.);
    }`);
  attach(gl.FRAGMENT_SHADER, `
    precision highp float;
    varying vec2 uv;
    uniform sampler2D photo;
    uniform float opening, readyLight, pixel;

    // Trace the original tied velvet wings: top, waist and hem.
    float hem(float y, bool left) {
      float top = left ? .183 : .17;
      float waist = left ? .003 : .005;
      float bottom = left ? .048 : .052;
      if(y < .54) return mix(top,waist,pow(y/.54,1.34));
      return mix(waist,bottom,pow((y-.54)/.46,1.3));
    }
    void main() {
      bool left = uv.x < .5;
      float x = left ? uv.x : 1.-uv.x;
      float rest = hem(uv.y,left);
      float travel = 1.-opening;
      float bow = .07*sin(3.14159*uv.y)*sin(3.14159*opening);
      float edge = mix(rest,.4997,travel)-bow;
      float shadow = (1.-smoothstep(edge,edge+.024*travel+pixel,x))*.28*travel;
      if(x >= edge+pixel){gl_FragColor=vec4(0.,0.,0.,shadow);return;}
      float u = clamp(x/edge,0.,1.);
      float folds = 6.28318*(u*5.3+.39*sin(uv.y*2.7)+.12*opening);
      float sampleX = (u+.021*sin(folds)*sin(3.14159*u)*travel)*rest;
      // Feed broader velvet from above the tie into the closed drape.
      float sampleY = mix(uv.y,uv.y*.33,travel);
      sampleX *= hem(sampleY,left)/rest;
      vec3 cloth = texture2D(photo,vec2(left ? sampleX : 1.-sampleX,sampleY)).rgb;
      float pleat = .76+.25*cos(folds)+.13*cos(2.*folds-.8);
      cloth *= mix(1.,pleat,travel);
      float seam = exp(-abs(uv.x-.5)*40.-pow((uv.y-.59)*2.7,2.));
      cloth += vec3(.18,.079,.019)*seam*readyLight*travel;
      float a = (1.-smoothstep(edge-pixel,edge+pixel,x))*smoothstep(0.,.075,travel);
      gl_FragColor=vec4(cloth*a,a);
    }`);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error(gl.getProgramInfoLog(program));
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
  gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1, 1,-1, -1,1, 1,1]),gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program,'position');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
  gl.bindTexture(gl.TEXTURE_2D,gl.createTexture());
  for (const param of [gl.TEXTURE_WRAP_S,gl.TEXTURE_WRAP_T]) gl.texParameteri(gl.TEXTURE_2D,param,gl.CLAMP_TO_EDGE);
  for (const param of [gl.TEXTURE_MIN_FILTER,gl.TEXTURE_MAG_FILTER]) gl.texParameteri(gl.TEXTURE_2D,param,gl.LINEAR);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,photo);
  const open = gl.getUniformLocation(program,'opening');
  const warmth = gl.getUniformLocation(program,'readyLight');
  const pixel = gl.getUniformLocation(program,'pixel');
  return (opening,light) => {
    const width = Math.min(photo.naturalWidth,Math.ceil(canvas.clientWidth*Math.min(devicePixelRatio,2)));
    if(canvas.width!==width) {
      canvas.width=width;
      canvas.height=Math.round(width*photo.naturalHeight/photo.naturalWidth);
      gl.viewport(0,0,canvas.width,canvas.height);
    }
    gl.uniform1f(open,opening);
    gl.uniform1f(warmth,light);
    gl.uniform1f(pixel,1/width);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  };
}

let draw, frame, clock, redirectTimer, generation=0;
const enter = document.querySelector('#enter');
const embedded = document.documentElement.classList.contains('lamp-scene');
function leaveStage() {
  if (embedded) window.parent.postMessage('portfolio-stage:close',location.origin);
  else location.assign(enter.href);
}
if (embedded) document.addEventListener('keydown',event=>{
  if (event.key === 'Escape') leaveStage();
});
function scheduleEntry(delay) {
  redirectTimer = window.setTimeout(leaveStage, delay);
}
function stop() {
  generation++;
  clearTimeout(redirectTimer);
  cancelAnimationFrame(frame);
  clock?.cancel();
  document.documentElement.classList.remove('loading-scene');
  stage.classList.remove('play');
  canvas.hidden=true;
}
async function play() {
  stop();
  if(motion.matches) {scheduleEntry(1500); return}
  const run=generation;
  document.documentElement.classList.add('loading-scene');
  await photo.decode();
  if(run!==generation) return;
  if(draw===undefined) {
    try {draw=curtainRenderer()} catch(error) {console.warn(error); draw=null}
  }
  document.documentElement.classList.remove('loading-scene');
  void stage.offsetWidth;
  stage.classList.add('play');
  scheduleEntry(7000 + 1500);
  if(!draw) return; // With WebGL disabled, the local lighting cues still play.
  canvas.hidden=false;
  const start=document.timeline.currentTime;
  // Use the browser's cubic-bezier interpolation as the common cloth clock.
  const timing = new KeyframeEffect(null,[],{duration:2850,delay:910,easing:'cubic-bezier(.39,.13,.37,.91)',fill:'both'});
  clock = new Animation(timing,document.timeline);
  clock.startTime=start;
  function paint(now) {
    const t=Math.max(0,(now-start)/1000);
    const reveal=timing.getComputedTiming().progress ?? 0;
    const breath=Math.min(t/.92,1);
    const preparation=.011*(1-Math.cos(breath*Math.PI))*.5;
    draw(preparation+(1-preparation)*reveal,breath*breath*(3-2*breath));
    if(t<3.76) frame=requestAnimationFrame(paint);
    else {canvas.hidden=true;clock.cancel()}
  }
  paint(start);
}

document.querySelector('#replay').onclick=()=>play().catch(stop);
window.addEventListener('pagehide',stop);
window.addEventListener('pageshow',event=>{if(event.persisted) play().catch(stop)});
motion.addEventListener('change',()=>play().catch(stop));
play().catch(stop);

(function(){
  let current='0', previous='', operator='', resetNext=false;
  const $r=document.getElementById('result'), $e=document.getElementById('expr');

  function fmt(n){
    if(n==='Error') return n;
    let num=parseFloat(n);
    if(isNaN(num)) return '0';
    if(Math.abs(num)>1e15||Math.abs(num)<1e-15&&num!==0) return num.toExponential(6);
    let s=parseFloat(num.toPrecision(12)).toString();
    return s;
  }

  function opSymbol(o){return{'*':' \u00d7 ','/':' \u00f7 ','+':" + ",'-':' \u2212 '}[o]||o}

  function update(){
    $r.textContent=current==='Error'?'Error':fmt(current);
    $e.textContent=previous&&operator?fmt(previous)+opSymbol(operator):'';
    let len=$r.textContent.length;
    $r.style.fontSize=len>12?'24px':len>8?'32px':'40px';
  }

  function calculate(a,op,b){
    a=parseFloat(a);b=parseFloat(b);
    if(isNaN(a)||isNaN(b)) return 'Error';
    let r;
    switch(op){
      case'+':r=a+b;break;case'-':r=a-b;break;
      case'*':r=a*b;break;case'/':r=b===0?'Error':a/b;break;
      default:r=b;
    }
    return r==='Error'?'Error':String(r);
  }

  function inputDigit(d){
    if(resetNext){current='0';resetNext=false}
    if(d==='.'){
      if(current.includes('.'))return;
      current+='.';
    }else{
      current=current==='0'?d:current+d;
    }
    update();
  }

  function inputOp(op){
    if(previous&&operator&&!resetNext){
      let res=calculate(previous,operator,current);
      previous=res;current=res;
    }else{
      previous=current;
    }
    operator=op;resetNext=true;
    update();
  }

  function inputEquals(){
    if(!operator||!previous)return;
    let res=calculate(previous,operator,current);
    let expr=fmt(previous)+opSymbol(operator)+fmt(current)+' =';
    current=res;previous='';operator='';resetNext=true;
    $e.textContent=expr;
    $r.textContent=fmt(current);
    let len=$r.textContent.length;
    $r.style.fontSize=len>12?'24px':len>8?'32px':'40px';
  }

  function inputClear(){current='0';previous='';operator='';resetNext=false;update()}

  function inputBackspace(){
    if(resetNext)return;
    current=current.length>1?current.slice(0,-1):'0';
    update();
  }

  function inputPercent(){
    current=String(parseFloat(current)/100);
    update();
  }

  document.querySelector('.buttons').addEventListener('click',function(e){
    let btn=e.target.closest('button');
    if(!btn)return;
    let a=btn.dataset.action;
    if(a==='digit')inputDigit(btn.dataset.val);
    else if(a==='op')inputOp(btn.dataset.val);
    else if(a==='equals')inputEquals();
    else if(a==='clear')inputClear();
    else if(a==='backspace')inputBackspace();
    else if(a==='percent')inputPercent();
  });

  document.addEventListener('keydown',function(e){
    if(e.key>='0'&&e.key<='9')inputDigit(e.key);
    else if(e.key==='.')inputDigit('.');
    else if(e.key==='+')inputOp('+');
    else if(e.key==='-')inputOp('-');
    else if(e.key==='*')inputOp('*');
    else if(e.key==='/')  {e.preventDefault();inputOp('/');}
    else if(e.key==='%')inputPercent();
    else if(e.key==='Enter'||e.key==='=')inputEquals();
    else if(e.key==='Backspace')inputBackspace();
    else if(e.key==='Escape'||e.key==='Delete')inputClear();
  });

  update();
})();

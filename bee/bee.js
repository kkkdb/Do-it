//用单体来实现，一个大的JSON
/* 功能：
        元素的生成（creatElement）
        运动（setInterval）
        碰撞检测（function）
        单兵作战（跟随运动算法）
        关卡设计（实现多关操作）
        积分
        ……
*/

window.onload = function(){
    var oBtn = document.getElementById('gameBtn');
    oBtn.onclick = function(){
        this.style.display = "none";
        Game.init('div1');    //游戏开始
    }
};

var Game ={
        oEnemy : {      //敌人
            e1 : {style : 'enemy1' , blood : 1 , speed : 5 , score : 1},
            e2 : {style : 'enemy2' , blood : 2 , speed : 6 , score : 2},
            e3 : {style : 'enemy3' , blood : 3 , speed : 7 , score : 3}
        },

        gk : [  //关卡的数据
            {
                eMap : [     //敌人的地图
                    'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                    'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                    'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                    'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                    'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                    'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
                    ],
                colNum : 10,
                iSpeedX : 10,
                iSpeedY : 10,
                times : 2000
            },
            {
            eMap : [     //敌人的地图
                'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                'e3','e3','e3','e3','e3','e3','e3','e3','e3','e3',
                'e2','e2','e2','e2','e2','e2','e2','e2','e2','e2',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1',
                'e1','e1','e1','e1','e1','e1','e1','e1','e1','e1'
            ],
            colNum : 10,
            iSpeedX : 10,
            iSpeedY : 10,
            times : 2000
            }
        ],

        air : {         //飞机的数据
            style : 'air1',
            bulletStyle : 'bullet'
        },

        init : function(id){      //初始化
            this.oParent = document.getElementById(id);
            this.createScore();
            this.createEmeny(0);
            this.createAir();
        },
        createScore : function(){       //积分
            var oS = document.createElement('div');
            oS.id = 'score';
            oS.innerHTML = '积分：<span>0</span>';
            this.oParent.appendChild(oS);
            this.oSNum = oS.getElementsByTagName('span')[0];
        },
        createEmeny : function(iNow){       //创建敌人

            if (this.oUl) {
                clearInterval(this.oUl.timer);
                this.oParent.removeChild(this.oUl);
            };

            document.title = '第'+(iNow+1)+'关';

            var gk = this.gk[iNow];
            var arr = [];
            var oUl = document.createElement('ul');
            this.oUl = oUl; // 变成对象属性 全局变量
            oUl.id = 'bee';
            oUl.style.width = gk.colNum * 40 +'px';
            this.oParent.appendChild(oUl);
            oUl.style.left = (this.oParent.offsetWidth - oUl.offsetWidth)/2 + 'px';

            for (var i = 0; i < gk.eMap.length; i++) {
                var oLi = document.createElement('li');
                this.aLi = oUl.getElementsByTagName('li');
                oLi.className = this.oEnemy[gk.eMap[i]].style;
                oUl.appendChild(oLi);
                oLi.blood = this.oEnemy[gk.eMap[i]].blood;
                oLi.speed = this.oEnemy[gk.eMap[i]].speed;
                oLi.score = this.oEnemy[gk.eMap[i]].score;
            };
            /*布局转换 将原先的浮动布局转换为定位布局*/
            for (var i = 0; i < this.aLi.length; i++) {
                arr.push([ this.aLi[i].offsetLeft,this.aLi[i].offsetTop ]) ;
            };

            for (var i = 0; i < this.aLi.length; i++) {
                this.aLi[i].style.position = "absolute";
                this.aLi[i].style.left = arr[i][0] + 'px';
                this.aLi[i].style.top = arr[i][1] + 'px';
            };

            this.runEnemy(gk);
        },
        runEnemy : function(gk){        //让敌人动起来
            var This = this;
            var L = 0;
            var R = This.oParent.offsetWidth-This.oUl.offsetWidth;
            this.oUl.timer = setInterval(function(){
                if (This.oUl.offsetLeft > R) {
                    gk.iSpeedX *= -1;                  
                    This.oUl.style.top = This.oUl.offsetTop + gk.iSpeedY + 'px';
                }else if (This.oUl.offsetLeft < L) {
                    gk.iSpeedX *= -1;
                    This.oUl.style.top = This.oUl.offsetTop + gk.iSpeedY + 'px';
                };
                This.oUl.style.left =  This.oUl.offsetLeft + gk.iSpeedX + 'px';
            },200);

            setInterval(function(){
                This.oneMove();
            }, gk.times)
        },

        oneMove : function(){       //单兵作战
            var solider = this.aLi[Math.floor((Math.random() * this.aLi.length))];
            var This = this;

            solider.timer = setInterval(function(){
                var a = (This.oA.offsetLeft + This.oA.offsetWidth/2) - (solider.offsetLeft + solider.offsetWidth/2 + solider.parentNode.offsetLeft);
                var b = (This.oA.offsetTop + This.oA.offsetHeight/2) - (solider.offsetTop+ solider.offsetHeight/2 + solider.parentNode.offsetTop);
                var c = Math.sqrt(a*a + b*b);
                var iSX = solider.speed * a / c;
                var iSY = solider.speed * b / c;
                solider.style.left = solider.offsetLeft + iSX + 'px';
                solider.style.top = solider.offsetTop + iSY + 'px'; 
                /*碰撞检测*/
                if (This.pz(This.oA,solider)) {
                    alert("game over!");
                    window.location.reload();
                };
            }, 30);
        },

        createAir : function(){         //创建飞机
            var oA = document.createElement('div');
            this.oA = oA;
            oA.className = this.air.style;
            this.oParent.appendChild(oA);
            oA.style.left = (this.oParent.offsetWidth - oA.offsetWidth)/2 + 'px';
            oA.style.top = this.oParent.offsetHeight - oA.offsetHeight + 'px';
            this.bingAir();
        },
        bingAir : function(){
            var timer = null;
            var iNum = 0 ;
            var This = this;
            document.onkeydown = function(ev){
                var ev = ev || evnet;
                if (!timer) {
                    timer = setInterval(show, 30);
                };
                if (ev.keyCode==37) {
                    iNum = 1;
                }else if (ev.keyCode==39) {
                    iNum = 2;
                }
                out();
            };
             document.onkeyup = function(ev){
                var ev = ev || evnet;
                clearInterval(timer);
                timer = null;
                iNum = 0;
                out();
                if (ev.keyCode==32) {
                    This.createBullet();
                };
               

            }
            function show(){
                if (iNum==1) { 
                    This.oA.style.left = This.oA.offsetLeft - 10 +'px';
                }else if(iNum==2) {
                    This.oA.style.left = This.oA.offsetLeft + 10 +'px';
                }
            }   
            function out(){     //规定飞机左右运动范围
                var L = This.oA.offsetWidth;
                var R = This.oParent.offsetWidth - This.oA.offsetWidth;
                if (This.oA.offsetLeft<L) {
                    This.oA.style.left = 0;
                }else if (This.oA.offsetLeft>R) {
                    This.oA.style.left =  R + 'px';
                }
            }
        },
        createBullet : function(){      //子弹的创建
            var oB = document.createElement('div');
            oB.className = this.air.bulletStyle;
            this.oParent.appendChild(oB);
            oB.style.left = this.oA.offsetLeft + this.oA.offsetWidth/2 + 'px';
            oB.style.top = this.oA.offsetTop - 10 + 'px';
            this.runBullet(oB);

        },
        runBullet : function(oB){       //子弹的运动
            var This = this;
            oB.timer = setInterval(function(){
                if (oB.offsetTop< -10) {
                    clearInterval(oB.timer);
                    This.oParent.removeChild(oB);
                }else{
                    oB.style.top = oB.offsetTop - 10 + 'px';
                }
                for (var i = 0; i < This.aLi.length; i++) {
                    if (This.pz(oB,This.aLi[i])) {
                        if (This.aLi[i].blood==1) {
                            clearInterval(This.aLi[i].timer);
                            This.oSNum.innerHTML = parseInt(This.oSNum.innerHTML) + This.aLi[i].score;
                            This.oUl.removeChild(This.aLi[i]);
                        }else{
                            This.aLi[i].blood--;
                        };
                        clearInterval(oB.timer); //先清理定时器 在删除子弹
                        This.oParent.removeChild(oB);
                    };
                };

                if (This.aLi.length==0) {
                    This.createEmeny(1);
                };

            },30); 
        },
        pz : function(obj1,obj2){       //碰撞检测
            var L1 = obj1.offsetLeft;
            var R1 = obj1.offsetLeft + obj1.offsetWidth;
            var T1 = obj1.offsetTop;
            var B1 = obj1.offsetTop + obj1.offsetHeight;

            var L2 = obj2.offsetLeft + obj2.parentNode.offsetLeft;
            var R2 = obj2.offsetLeft + obj2.offsetWidth + obj2.parentNode.offsetLeft;
            var T2 = obj2.offsetTop +  obj2.parentNode.offsetTop;
            var B2 = obj2.offsetTop + obj2.offsetHeight + obj2.parentNode.offsetTop;
            if (R1 < L2||L1 > R2||B1 < T2||T1 > B2) {
                return false;
            }else{
                return true;
            }
        }
        
    }

let stone=[];
let index=[1,2,3,5,6,7,10,14,15,21,30,35,42,70,105,210];
let num=-1,dx,dy,m,x1,x2,y1,y2,mode=0;
let peer,room;

function setup(){
    createCanvas(windowWidth,windowHeight);

    peer=new Peer({
        key: 'cf1155ef-ab9f-41a3-bd4a-b99c30cc0663',
        debug:1
    });

    peer.on('open',()=>{
        room=peer.joinRoom("quarto",{
            mode:'sfu'
        });
        room.on('open',()=>{
            pnum=room.members.length+1;
        });
        room.on('peerJoin',peerId=>{
            console.log(peerId+"参加");
        });
        room.on('peerLeave',peerId=>{
            console.log(peerId+"退出");
        });
        room.on('data',message=>{
            receive(message.data);
        });
    });

    for(let i=0;i<16;i++)   stone[i]=new Stone(index[i],600+100*(i%4),100+100*int(i/4));
}

function draw(){
    background(255);

    for(let i=0;i<4;i++)    for(let j=0;j<4;j++){
        noFill();
        rect(50+100*i,50+100*j,100,100);
    }
    for(let i=0;i<16;i++)   stone[i].disp();

    if(num>=0){
        stone[num].x=mouseX+dx;
        stone[num].y=mouseY+dy;
    }

    if(mode>0){
        stone[m].x=map(mode,30,1,x1,x2);
        stone[m].y=map(mode,30,1,y1,y2);
        mode--;
    }
}

function mousePressed(){
    for(let i=0;i<stone.length;i++){
        if(dist(mouseX,mouseY,stone[i].x,stone[i].y)<35){
            num=i;
            dx=stone[i].x-mouseX;
            dy=stone[i].y-mouseY;
        }
    }
}

function mouseReleased(){
    if(num>=0)  room.send(num+','+(mouseX+dx)+','+(mouseY+dy));
    num=-1;
}

function keyPressed(){
    if(key=='r'){
        reset();
        room.send("reset");
    }
}

class Stone{
    constructor(n,x,y){
        this.n=n;
        this.x=x;
        this.y=y;
    }

    disp(){
        fill(230);
        strokeWeight(2);
        circle(this.x,this.y,70);
        textAlign(CENTER,CENTER);
        fill(0);
        textSize(35);
        text(this.n,this.x,this.y);
    }
}

function receive(s){
    console.log(s);
    if(s=="reset"){
        reset();
    }else{
        s=s.split(',');
        mode=30;
        for(let i=0;i<3;i++)    s[i]=int(s[i]);
        m=s[0];
        x1=stone[m].x;
        y1=stone[m].y;
        x2=s[1];
        y2=s[2];
    }
}

function reset(){
    for(let i=0;i<16;i++){
        stone[i].x=600+100*(i%4);
        stone[i].y=100+100*int(i/4);
    }
    num=-1;
    mode=0;
}
import { Component, NgZone, OnInit } from '@angular/core';
import * as phaser from 'phaser';

class Scene extends phaser.Scene{
  img: phaser.GameObjects.Image | undefined;
  box: phaser.Physics.Matter.Image | undefined;
  platform: phaser.Physics.Matter.Image | undefined;

  constructor(config: string | phaser.Types.Scenes.SettingsConfig){
    super(config);
  }

  preload(){
    // const imgURL = 'https://i.pinimg.com/originals/92/47/22/92472268da60310eb9b5738ae146deb2.png';
    // const imgURL = 'https://via.placeholder.com/150';
    const imgURL = 'assets/cloud.png';
    this.load.setBaseURL('http://localhost:4200/');
    this.load.image('cloud', imgURL);
    this.load.image('ball', 'assets/marble.png');
    this.load.image('box', 'assets/box.jpeg');
    this.load.image('platform', 'assets/platform.png');
    console.log("Scene Preload Called!");
  }

  create(){
    this.img = this.add.image(0, 0, 'cloud');
    this.img.setOrigin(0, 0);
    this.img.setScale(0.5, 0.5);

    this.box = this.matter.add.image(0, 0, 'box', undefined, {
      isStatic: true,
      ignorePointer: true,
      ignoreGravity: true
    });
    this.box.setX(100);
    this.box.setY(400);
    const scale = 200 / this.box.displayWidth;
    this.box.setScale(scale, scale);
    this.box.setRotation(Math.PI / 180 * 25);

    this.platform = this.matter.add.image(0, 0, 'platform', undefined, {
      isStatic: true,
      ignoreGravity: true,
      friction: 0.98
    })
    this.platform.setX(400);
    this.platform.setY(575);
    this.platform.setScale(800 / this.platform.displayWidth, 50 / this.platform.displayHeight);

    console.log("Scene Create Called!");    

    this.platform.setOnCollide((args: Phaser.Types.Physics.Matter.MatterCollisionData) => {
      console.log("Platform collided!", args.bodyA, args.bodyB);
    });
  }

  update(){
    phaser.Actions.RotateAround([this.img!], {x: 100, y: 100}, Math.PI / 180.0);
    phaser.Actions.Rotate([this.box!], Math.PI / 180.0);
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'phaser-ng-test';
  game: phaser.Game | undefined;

  changingProperty: string = 'no value';

  constructor(
    private zone: NgZone
  ){

  }

  ngOnInit(){
    this.zone.runOutsideAngular(() => {
      this.setupPhaserGame();
    });
    
  }

  setupPhaserGame(){
    console.log("Going to setup phaser game...");
    const config = {
      type: phaser.AUTO,
      width: 800,
      height: 600,
      parent: 'phaser-canvas-container',
      scene: [ Scene ],
      backgrouncColor: '#ffffff',
      physics: {
        default: 'matter',
        matter: {
          debug: true
        }
      },
      fps: {
        // target: 25,
        // forceSetTimeOut: true
      }
    }
    this.game = new phaser.Game(config);
  }

  change(){
    const time = this.makeid(5);
    this.changingProperty = time;
    console.log("Changed property to", this.changingProperty);
  }

  makeid(length: number): string{
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
      charactersLength));
    }
    return result;
  }

  releaseBall(){
    const scene = this.game!.scene.getScenes()[0];
    const physicsBall = scene.matter.add.image(200, 0, 'ball', undefined, {
      circleRadius: 1,
      angle: Math.PI / 180 * 4,
      density: 100,
      friction: 0.1
    });
    physicsBall.setScale(0.05, 0.05); 
    // physicsBall.setCircle(10);
  }
}

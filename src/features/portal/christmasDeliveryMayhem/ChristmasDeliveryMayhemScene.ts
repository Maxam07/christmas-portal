import mapJson from "assets/map/christmasDeliveryMayhem.json";
import tilesetconfig from "assets/map/christmas_tileset.json";
import { SceneId } from "features/world/mmoMachine";
import { BaseScene } from "features/world/scenes/BaseScene";
import { SQUARE_WIDTH } from "features/game/lib/constants";
import { MachineInterpreter } from "./lib/christmasDeliveryMayhemMachine";
import {
  COALS_CONFIGURATION,
  GIFT_CONFIGURATION,
  BONFIRE_CONFIGURATION,
  ELVES_CONFIGURATION,
  GRIT_CONFIGURATION,
  SNOWSTORM_CONFIGURATION,
  GRIT_DURATION,
} from "./ChristmasDeliveryMayhemConstants";
import { GiftContainer } from "./containers/GiftContainer";
import { BonfireContainer } from "./containers/BonfireContainer";
import { ElfContainer } from "./containers/ElfContainer";
import { GritContainer } from "./containers/GritContainer";
import { NewSnowStormContainer } from "./containers/NewSnowStormContainer";
import { CoalsContainer } from "./containers/NewCoals";

// export const NPCS: NPCBumpkin[] = [
//   {
//     x: 380,
//     y: 400,
//     // View NPCModals.tsx for implementation of pop up modal
//     npc: "portaller",
//   },
// ];

export class ChristmasDeliveryMayhemScene extends BaseScene {
  sceneId: SceneId = "christmas_delivery_mayhem";
  private snowStorm!: NewSnowStormContainer;
  private gritContainer!: GritContainer;
  private coal!: CoalsContainer;
  private coalsArray: (Phaser.Physics.Arcade.Sprite & {
    respawnTimer?: Phaser.Time.TimerEvent;
  })[] = [];

  constructor() {
    super({
      name: "christmas_delivery_mayhem",
      map: {
        json: mapJson,
        imageKey: "christmas-tileset",
        defaultTilesetConfig: tilesetconfig,
      },
      audio: { fx: { walk_key: "dirt_footstep" } },
    });
  }

  preload() {
    super.preload();

    this.load.spritesheet("krampus", "world/krampus.png", {
      frameWidth: 20,
      frameHeight: 19,
    });

    this.load.spritesheet("coalspawn_spritesheet", "world/coalspawn_spritesheet.png", {
      frameWidth: 10,
      frameHeight: 30,
    });

    this.load.spritesheet("coal", "world/coal.png", {
      frameWidth: 12,
      frameHeight: 12,
    }) 

    this.load.spritesheet("snowstorm_left_final_tileset", "world/snowstorm_left_final_tileset.png", {
      frameWidth: 544,
      frameHeight: 320,
    });

    this.load.spritesheet("snowstorm_right_final_tileset_2", "world/snowstorm_right_final_tileset_2.png", {
      frameWidth: 544,
      frameHeight: 320,
    });

    this.load.spritesheet("snowstorm_final_tileset", "world/snowstorm_final_tileset.png", {
      frameWidth: 544,
      frameHeight: 320,
    });

    this.load.spritesheet("Grit_Carrying", "world/Grit_Carrying.webp", {
      frameWidth: 25,
      frameHeight: 19,
    });

    this.load.spritesheet("Grit_up", "world/Grit_up.webp", {
      frameWidth: 25,
      frameHeight: 19,
    });

    this.load.spritesheet("Grit_escape", "world/Grit_escape.png", {
      frameWidth: 14,
      frameHeight: 17,
    });

    // subject to change
    this.load.spritesheet("sand", "world/sand.webp", {
      frameWidth: 14,
      frameHeight: 10,
    });

    // Gifts
    this.load.spritesheet("gift_1", "world/gift_1.png", {
      frameWidth: 16,
      frameHeight: 18,
    });
    this.load.spritesheet("gift_2", "world/gift_2.png", {
      frameWidth: 16,
      frameHeight: 18,
    });
    this.load.spritesheet("gift_3", "world/gift_3.png", {
      frameWidth: 16,
      frameHeight: 18,
    });
    this.load.spritesheet("gift_4", "world/gift_4.png", {
      frameWidth: 16,
      frameHeight: 18,
    });
    this.load.spritesheet("gift_5", "world/gift_5.png", {
      frameWidth: 16,
      frameHeight: 18,
    });
    this.load.spritesheet("gift_6", "world/gift_6.png", {
      frameWidth: 16,
      frameHeight: 18,
    });

    // Bonfire
    this.load.spritesheet("bonfire", "world/bonfire.png", {
      frameWidth: 23,
      frameHeight: 40,
    });

    // Elves
    this.load.spritesheet("elf", "world/elf.png", {
      frameWidth: 20,
      frameHeight: 19,
    });
  }

  async create() {
    this.map = this.make.tilemap({
      key: "christmas_delivery_mayhem",
    });

    super.create();

    this.createGifts();
    this.createBonfires();
    this.createElves();
    this.createCoals();
    this.createSnowStorm();
    this.snowStorm.normalSnowStorm()
    
    setTimeout(() => {
      this.createGrit();
    }, 10000); // 20000

    // this.physics.world.drawDebug = true;

    //For testing only. Remove when not used.
    setTimeout(() => {
      if (this.gritContainer) {
        this.gritContainer.deactivate();
      }
    }, 20000); // 20000

    //For testing only. Remove when not used.
    setTimeout(() => {
      if (this.snowStorm) {
        this.snowStorm.deactivateSnowstorm(); // Deactivate the snowstorm after 10 seconds
      }
    }, 20000); // 20000

    // this.initialiseNPCs(NPCS);
  }

  private get isGameReady() {
    return this.portalService?.state.matches("ready") === true;
  }

  public get portalService() {
    return this.registry.get("portalService") as MachineInterpreter | undefined;
  }

  update() {
    super.update();

    if (this.snowStorm?.isActive) {
      this.snowStorm.speedDirection();
    }

    // Player current position
    // console.log({y: this.currentPlayer?.y, x: this.currentPlayer?.x})

    if (this.isGameReady) {
      this.portalService?.send("START");
    }
  }

  private createSnowStorm() {
    this.snowStorm = new NewSnowStormContainer({
      x: SNOWSTORM_CONFIGURATION.x,
      y: SNOWSTORM_CONFIGURATION.y,
      scene: this,
      player: this.currentPlayer,
    });
    // this.snowStorm.activateSnowstorm();
  }

  private createGrit() {
    GRIT_CONFIGURATION.forEach((config) => {
      this.gritContainer = new GritContainer({
        x: config.x,
        y: config.y,
        scene: this,
        player: this.currentPlayer,
      });
      this.gritContainer.activate();
    });
  }

  private createCoals() {
    COALS_CONFIGURATION.forEach(
      (config) =>
        this.coal = new CoalsContainer({
          x: config.x,
          y: config.y,
          scene: this,
          player: this.currentPlayer,
        }),
        // this.coal.activate()
    );
  }

  private createGifts() {
    GIFT_CONFIGURATION.forEach(
      (config) =>{
        new GiftContainer({
          x: config.x,
          y: config.y,
          scene: this,
          name: config.name,
          player: this.currentPlayer,
        })
    });
  }

  private createBonfires() {
    BONFIRE_CONFIGURATION.forEach(
      (config) =>
        new BonfireContainer({
          x: config.x,
          y: config.y,
          scene: this,
          player: this.currentPlayer,
        }),
    );
  }

  private createElves() {
    ELVES_CONFIGURATION.forEach(
      (config) =>
        new ElfContainer({
          x: config.x,
          y: config.y,
          scene: this,
          direction: config.direction,
          player: this.currentPlayer,
        }),
    );
  }

  private setDefaultState() {}
}

import { BumpkinContainer } from "features/world/containers/BumpkinContainer";
import { BaseScene } from "features/world/scenes/BaseScene";
import {
  DROP_ANIMATION_GIFT_CONFIGURATION,
  GIFT_RESPAWN,
  Gifts,
  MAX_PLAYER_GIFTS,
} from "../ChristmasDeliveryMayhemConstants";
import { MachineInterpreter } from "../lib/christmasDeliveryMayhemMachine";
import { translate } from "lib/i18n/translate";

interface Props {
  x: number;
  y: number;
  scene: BaseScene;
  name: Gifts;
  player?: BumpkinContainer;
  removedAnim?: boolean;
}

export class GiftContainer extends Phaser.GameObjects.Container {
  private spriteName: string;
  private player?: BumpkinContainer;
  private sprite: Phaser.GameObjects.Sprite;

  scene: BaseScene;

  constructor({ x, y, scene, name, player, removedAnim = false }: Props) {
    super(scene, x, y);
    this.scene = scene;
    this.spriteName = name;
    this.player = player;

    // Gift Sprite
    const spriteName = name;
    this.sprite = scene.add.sprite(0, 0, spriteName).setOrigin(0);

    // Action - Overlap
    this.handleOverlap();

    if (removedAnim) {
      this.sprite.setScale(0.5).setOrigin(0.5);

      const label = this.scene.add.bitmapText(
        -9,
        -2,
        "Teeny Tiny Pixls",
        "-1",
        3,
      );
      this.add(label);
    }

    this.setSize(this.sprite.width, this.sprite.height);
    this.add(this.sprite);

    scene.add.existing(this);
  }

  public get portalService() {
    return this.scene.registry.get("portalService") as
      | MachineInterpreter
      | undefined;
  }

  private handleOverlap() {
    if (!this.player) return;

    this.scene.physics.world.enable(this);

    (this.body as Phaser.Physics.Arcade.Body)
      .setSize(this.sprite.width, this.sprite.height)
      .setOffset(this.sprite.width / 2, this.sprite.height / 2)
      .setImmovable(true)
      .setCollideWorldBounds(true);

    this.scene.physics.add.overlap(
      this.player as Phaser.GameObjects.GameObject,
      this as Phaser.GameObjects.GameObject,
      () => this.collectGift(),
    );
  }

  private collectGift() {
    const collectedGifts = this.portalService?.state?.context.gifts as string[];
    if (collectedGifts.length === MAX_PLAYER_GIFTS) {
      this.player?.speak(translate("christmas-delivery-mayhem.noMoreSpace"));
      return;
    }

    this.setVisible(false);
    this.scene.physics.world.disable(this);
    this.portalService?.send("COLLECT_GIFT", { gift: this.spriteName });

    this.scene.time.delayedCall(GIFT_RESPAWN, () => {
      this.setVisible(true);
      this.scene.physics.world.enable(this);
    });
  }

  playRemovalAnimation(index: number) {
    const config = DROP_ANIMATION_GIFT_CONFIGURATION;

    this.scene.tweens.add({
      targets: [this],
      props: {
        x: { value: `+=${config[index].x}`, duration: 1000, ease: "Power2" },
        y: {
          value: `+=${config[index].y}`,
          duration: 500,
          ease: "Bounce.easeOut",
        },
      },
      onComplete: () => this.destroy(),
    });
  }
}

import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import { Label } from "components/ui/Label";
import { useAppTranslation } from "lib/i18n/useAppTranslations";
import { PortalMachineState } from "../../lib/christmasDeliveryMayhemMachine";

const _target = (state: PortalMachineState) =>
  state.context.state?.minigames.prizes["christmas-delivery"]?.score ?? 0;
const _score = (state: PortalMachineState) => state.context.score;

export const ChristmasDeliveryMayhemTarget: React.FC = () => {
  const { portalService } = useContext(PortalContext);
  const { t } = useAppTranslation();

  const target = useSelector(portalService, _target);
  const score = useSelector(portalService, _score);

  const isTargetReached = score >= target;

  return (
    <Label
      icon={SUNNYSIDE.resource.pirate_bounty}
      secondaryIcon={isTargetReached ? SUNNYSIDE.icons.confirm : undefined}
      type={isTargetReached ? "success" : "vibrant"}
    >
      {t("christmas-delivery.targetScore", {
        target: target,
      })}
    </Label>
  );
};

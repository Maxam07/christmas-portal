import React, { useContext } from "react";
import { useSelector } from "@xstate/react";
import { PortalContext } from "../../lib/PortalProvider";
import { SUNNYSIDE } from "assets/sunnyside";
import useUiRefresher from "lib/utils/hooks/useUiRefresher";
import { Label } from "components/ui/Label";
import { PortalMachineState } from "../../lib/christmasDeliveryMayhemMachine";
import { secondsToString } from "lib/utils/time";
import { GAME_SECONDS } from "../../ChristmasDeliveryMayhemConstants";

const _endAt = (state: PortalMachineState) => state.context.endAt;

export const ChristmasDeliveryMayhemTimer: React.FC = () => {
  useUiRefresher({ delay: 100 });

  const { portalService } = useContext(PortalContext);

  const endAt = useSelector(portalService, _endAt);

  const secondsLeft = !endAt
    ? GAME_SECONDS
    : Math.max(endAt - Date.now(), 0) / 1000;

  return (
    <Label icon={SUNNYSIDE.icons.stopwatch} type={"info"}>
      {secondsToString(secondsLeft, { length: "full" })}
    </Label>
  );
};

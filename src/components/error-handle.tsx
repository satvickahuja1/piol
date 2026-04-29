import { CheckCircle2Icon, InfoIcon } from "lucide-react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./ui/alert";
import { Button } from "./ui/button";

interface model {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const upgradeModel = ({ open, onOpenChange }: model) => {
  <Alert className="max-w-md">
    <CheckCircle2Icon />
    <AlertTitle>Account updated successfully</AlertTitle>
    <AlertDescription>
      Your profile information has been saved. Changes will be reflected
      immediately.
    </AlertDescription>
    <div>
      <Alert>
        <InfoIcon />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>
          You can add components and dependencies to your app using the cli.
        </AlertDescription>
        <AlertAction>
          <Button variant="outline">Enable</Button>
        </AlertAction>
      </Alert>
    </div>
  </Alert>;
};

import { Button, Stack, Typography } from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";
import PathConstants from "~/routes";

export default function HomePage() {
  return (
    <>
      <Typography level="h1" textAlign="center">
        Bienvenue
      </Typography>
      <Typography level="body-lg" textAlign="center">
        Que souhaitez-vous faire aujourd&apos;ui ?
      </Typography>
      <Stack
        alignItems="center"
        direction={["column", "row"]}
        justifyContent="center"
        marginTop={3}
      >
        <Button
          component={RouterLink}
          size="lg"
          to={PathConstants.DELIVERER_LIST}
        >
          Gérer mes livreurs
        </Button>
      </Stack>
    </>
  );
}

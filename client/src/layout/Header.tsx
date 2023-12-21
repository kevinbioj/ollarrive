import { Box, Container, Link, Typography } from "@mui/joy";
import { Link as RouterLink } from "react-router-dom";

import PathConstants from "~/routes";

export default function Header() {
  return (
    <Box bgcolor="#1bb18e" component="header">
      <Container>
        <Typography level="h1">
          <Link
            color="neutral"
            component={RouterLink}
            to={PathConstants.HOME}
            underline="none"
          >
            Ollarrive
          </Link>
        </Typography>
      </Container>
    </Box>
  );
}

import { Container } from "@mui/joy";
import { Outlet } from "react-router-dom";
import { QueryParamProvider } from "use-query-params";
import { ReactRouter6Adapter } from "use-query-params/adapters/react-router-6";

import Header from "~/layout/Header";

export default function Layout() {
  return (
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <Header />
      <Container component="main" sx={{ marginTop: 3 }}>
        <Outlet />
      </Container>
    </QueryParamProvider>
  );
}

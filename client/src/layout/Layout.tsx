import { Container } from "@mui/joy";
import { Outlet } from "react-router-dom";

import Header from "~/layout/Header";

export default function Layout() {
  return (
    <>
      <Header />
      <Container component="main" sx={{ marginTop: 3 }}>
        <Outlet />
      </Container>
    </>
  );
}

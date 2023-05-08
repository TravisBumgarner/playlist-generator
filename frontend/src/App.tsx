import { CssBaseline } from "@mui/material"
import { PageHeader, Alert, Router, Navigation } from "./components"

const App = () => {
  return (
    <div>
      <CssBaseline />
      <PageHeader />
      <Navigation />
      <Alert />
      <Router />
    </div>
  )
}

export default App

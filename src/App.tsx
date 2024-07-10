import { Authenticated, Refine } from "@refinedev/core";
import routerProvider, { NavigateToResource } from "@refinedev/react-router-v6";
import {
  ThemedLayoutV2,
  ThemedTitleV2,
  useNotificationProvider,
} from "@refinedev/antd";

import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

// We'll wrap our app with Ant Design's ConfigProvider to set the theme and App component to use the theme properly.
import { ConfigProvider, App as AntdApp } from "antd";
// import { dataProvider } from "./providers/data-provider";
import { ShowProduct } from "./pages/products/show";
import { EditProduct } from "./pages/products/edit";
import { ListProducts } from "./pages/products/list";
import { CreateProduct } from "./pages/products/create";
// import { authProvider } from "./providers/auth-provider";
import { Login } from "./pages/login";
// We're importing a reset.css file to reset the default styles of the browser.
import "antd/dist/reset.css";

import PocketBase from "pocketbase";
import { authProvider, dataProvider } from "refine-pocketbase";

export default function App(): JSX.Element {

  const pb = new PocketBase("http://127.0.0.1:8090/");

  return (
    <BrowserRouter>
      <ConfigProvider>
        <AntdApp>
          <Refine
            dataProvider={dataProvider(pb)}
            authProvider={authProvider(pb)}
            routerProvider={routerProvider}
            notificationProvider={useNotificationProvider}
            resources={[
              {
                name: "products",
                list: "/products",
                show: "/products/:id",
                edit: "/products/:id/edit",
                create: "/products/create",
                meta: { label: "Products" },
              },
            ]}
          >
            <Routes>
              <Route
                element={
                  // We're wrapping our routes with the `<Authenticated />` component
                  // We're omitting the `fallback` prop to redirect users to the login page if they are not authenticated.
                  // If the user is authenticated, we'll render the `<Header />` component and the `<Outlet />` component to render the inner routes.
                  <Authenticated key="authenticated-routes" redirectOnFail="/login">
                    <ThemedLayoutV2
                      Title={(props) => (
                        <ThemedTitleV2 {...props} text="Awesome Project" />
                      )}
                    >
                      <Outlet />
                    </ThemedLayoutV2>
                  </Authenticated>
                }
              >
                <Route index
                  // We're also replacing the <Navigate /> component with the <NavigateToResource /> component.
                  // It's tailored version of the <Navigate /> component that will redirect to the resource's list route.
                  element={<NavigateToResource resource="products" />}
                />
                <Route path="/products">
                  <Route index element={<ListProducts />} />
                  <Route path=":id" element={<ShowProduct />} />
                  <Route path=":id/edit" element={<EditProduct />} />
                  <Route path="create" element={<CreateProduct />} />
                </Route>
                <Route index element={<ListProducts />} />
              </Route>
              <Route
                element={
                  <Authenticated key="auth-pages" fallback={<Outlet />}>
                    {/* We're also replacing the <Navigate /> component with the <NavigateToResource /> component. */}
                    {/* It's tailored version of the <Navigate /> component that will redirect to the resource's list route. */}
                    <NavigateToResource resource="protected-products" />
                  </Authenticated>
                }
              >
                <Route path="/login" element={<Login />} />
              </Route>
            </Routes>
          </Refine>
        </AntdApp>
      </ConfigProvider>
    </BrowserRouter >
  );
}
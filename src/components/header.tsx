import React from "react";
import { useLogout, useGetIdentity, useNavigation } from "@refinedev/core";

import { Link } from "react-router-dom";

export const Header = () => {
  const { mutate, isLoading } = useLogout();
  const { data: identity } = useGetIdentity();
  const typedIdentity = identity as { name: string };

  // You can also use methods like list or create to trigger navigation.
  // We're using url methods to provide more semantically correct html.
  const { listUrl, createUrl } = useNavigation();

  const handleLogout = () => {
    mutate();
  };

  return (
    <>
      <h2>
        <span>Welcome, </span>
        <span>{typedIdentity?.name ?? ""}</span>
      </h2>
      <Link to={listUrl("protected-products")}>List Products</Link>
      <Link to={createUrl("protected-products")}>Create Product</Link>
      <button
        type="button"
        disabled={isLoading}
        onClick={handleLogout}
      >
        Logout
      </button>
    </>
  );
};
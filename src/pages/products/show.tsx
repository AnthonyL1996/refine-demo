import { useShow, useOne } from "@refinedev/core";
import { TextField, NumberField, MarkdownField, Show } from "@refinedev/antd";

import { Typography } from "antd";

export const ShowProduct = () => {
  const {
    queryResult: { data, isLoading },
  } = useShow();

  const { data: categoryData, isLoading: categoryIsLoading } = useOne({
    resource: "categories",
    id: data?.data?.category || "",
    queryOptions: {
      enabled: !!data?.data,
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <Show isLoading={isLoading}>
      <Typography.Title level={5}>Id</Typography.Title>
      <TextField value={data?.data?.id} />

      <Typography.Title level={5}>Name</Typography.Title>
      <TextField value={data?.data?.name} />

      <Typography.Title level={5}>Description</Typography.Title>
      <MarkdownField value={data?.data?.description} />

      <Typography.Title level={5}>Material</Typography.Title>
      <TextField value={data?.data?.material} />

      <Typography.Title level={5}>Category</Typography.Title>
      <TextField
        value={categoryIsLoading ? "Loading..." : categoryData?.data?.title}
      />

      <Typography.Title level={5}>Price</Typography.Title>
      <NumberField value={data?.data?.price} />
    </Show>
  );
};
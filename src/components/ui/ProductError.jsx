import { Alert } from "antd";

export const ProductError = () => {
  return (
    <div>
      {" "}
      <div className="container mx-auto px-4 py-8 flex justify-center">
        <Alert
          type="error"
          message="Error"
          description="Sorry, we couldn't load the products. Please try again later."
          className="mt-10 max-w-lg"
        />
      </div>
    </div>
  );
};

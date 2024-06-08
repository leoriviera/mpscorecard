import { useState, FormEvent } from "react";

const PostcodeInput: React.FC = () => {
  const [postcode, setPostcode] = useState<string>();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <div>
      <h1>Form Page</h1>
      <form onSubmit={handleSubmit}>
        <input name="Postcode" placeholder="" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default PostcodeInput;

import Button from "@/components/v2/Button";
import CardContent from "@/components/v2/CardContent";
import Input from "@/components/v2/Input";

const APIKeys = () => {
  return (
    <CardContent title="API Keys" overrideStyles="xl:col-span-2">
      <div className="grid xl:grid-rows-3 xl:grid-flow-col gap-4">
        <Input title="Open AI" />
        <Input title="Anthropic" />
        <Input title="Google Generative AI" />
        <Input title="Mistral" />
        <Input title="Fireworks" />
        {/* <Input title="Grooq" /> */}
      </div>
      <Button disabled>Update API Keys</Button>
    </CardContent>
  );
};

export default APIKeys;

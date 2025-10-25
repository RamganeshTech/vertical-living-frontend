// import { useParams } from "react-router-dom";
import ModularUnitFormNew from "./ModularUnitFormNew";

const CreateModularUnitNew = () => {
    // const { organizationId } = useParams<{ organizationId: string }>();

    return (
        <main className="max-h-full overflow-y-auto">

            <ModularUnitFormNew mode="create" />;
        </main>)
};

export default CreateModularUnitNew;
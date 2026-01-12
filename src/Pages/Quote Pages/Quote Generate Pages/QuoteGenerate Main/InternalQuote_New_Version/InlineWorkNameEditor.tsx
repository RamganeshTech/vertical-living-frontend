
import { useEffect, useState } from 'react';
import { useRenameWorkItem } from '../../../../../apiList/Quote Api/Internal_Quote_Api/internalQuoteNewVersionApi';
import { useDebounce } from '../../../../../Hooks/useDebounce';
// import SublettingTemplate from '../../../WorkData_Page/Subletting_Template/SublettingTemplate';

interface Props {
    work: any;
    quoteId: string;
}

const InlineWorkNameEditor: React.FC<Props> = ({  work, quoteId }) => {
    const [localName, setLocalName] = useState(work.workName);
    const renameMutation = useRenameWorkItem();

    // Apply your manual debounce hook
    const debouncedName = useDebounce(localName, 600);

    useEffect(() => {
        // Only trigger mutation if the name has actually changed and isn't empty
        if (debouncedName && debouncedName !== work.workName) {
            renameMutation.mutate({
                quoteId,
                workId: work._id,
                workName: debouncedName
            });
        }
    }, [debouncedName, quoteId, work._id, work.workName]);

    return (
        <input
            value={localName.toUpperCase()}
            onChange={(e) => setLocalName(e.target.value)}
            className="text-[9px] font-black text-slate-400  tracking-tighter truncate max-w-[140px] 
                       bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 
                       focus:text-slate-600 outline-none transition-all cursor-text py-0.5"
            placeholder="ENTER AREA NAME"
        />
    );
};





export default InlineWorkNameEditor
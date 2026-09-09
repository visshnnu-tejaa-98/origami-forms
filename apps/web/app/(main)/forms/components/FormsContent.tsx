import React from "react";
import { FormsContentProps } from "../../types";
import { EMPTY_COPY, LIST } from "../../constants";
import { FormsViewSkeleton } from "../skeletons";
import ErrorComponent from "../../components/ErrorComponent";
import EmptyTemplate from "./EmptyTemplate";
import { useRouter } from "next/navigation";
import FromListView from "./FormListView";
import FormGridView from "./FormGridView";
import Pagination from "../../components/Pagination";
import { Icon, IconName } from "../../components/icons";

export const CardIcon = ({ logoUrl, icon, isLogoExists }: { logoUrl: string, icon: IconName, isLogoExists: boolean }) => {
    if (isLogoExists) {
        return (
            <span className="ic ic--logo">
                <img src={logoUrl} alt="" loading="lazy" />
            </span>
        );
    }
    return (
        <span className="ic tint-ic">
            <Icon name={icon} size={22} />
        </span>
    );
}


const FormsContent = (props: FormsContentProps) => {
    const { loading, selectedTab, forms, view, listFormsError, refetchForms, pagination } = props;
    const { data, pageOptions, setPage, showPagination } = pagination;

    const router = useRouter();

    const handleCreateNewForm = () => {
        router.push("/builder");
    };

    if (loading) return <FormsViewSkeleton />;

    if (listFormsError) {
        return (
            <ErrorComponent
                onClick={refetchForms}
                message={listFormsError.message || "Failed to load forms"}
            />
        );
    }

    if (forms.length === 0) {
        const copy = EMPTY_COPY[selectedTab] ?? EMPTY_COPY.all;
        return (
            <EmptyTemplate
                cta="Fold a new form"
                title={copy.title}
                description={copy.description}
                icon="crane"
                onClick={handleCreateNewForm}
            />
        );
    }

    return (
        <>
            {view === LIST ? <FromListView forms={forms} /> : <FormGridView forms={forms} />}
            {showPagination && <Pagination data={data} setPage={setPage} pageOptions={pageOptions} />}
        </>
    );
};

export default FormsContent;

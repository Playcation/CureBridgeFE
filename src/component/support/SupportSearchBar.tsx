import React, { useState } from "react";
import styles from "./SupportSearchBar.module.css";

type Props = {
    onSearch: (type: "title" | "all", keyword: string) => void;
    loading?: boolean;
};

function SupportSearchBar({ onSearch, loading }: Props) {
    const [type, setType] = useState<"title" | "all">("title");
    const [keyword, setKeyword] = useState("");

    return (
        <div className={styles.bar}>
            <select
                className={styles.select}
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                disabled={!!loading}
            >
                <option value="title">제목</option>
                <option value="all">제목+내용</option>
            </select>

            <input
                className={styles.input}
                placeholder="검색어를 입력하세요"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                disabled={!!loading}
            />

            <button
                className={styles.button}
                onClick={() => onSearch(type, keyword)}
                disabled={!!loading}
            >
                검색
            </button>
        </div>
    );
}

export default SupportSearchBar;

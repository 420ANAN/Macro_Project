import React from 'react';

export default function SearchForm({ title, children, onSearch, onReset }) {
    return (
        <fieldset>
            <legend>{title}</legend>
            <div className="form-grid">
                {children}
            </div>
            <div className="btn-group">
                <button type="button" className="btn btn-primary" onClick={onSearch}>Search</button>
                <button type="button" className="btn btn-secondary" onClick={onReset}>Reset</button>
            </div>
        </fieldset>
    );
}

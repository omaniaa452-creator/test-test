/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useRef, useState } from 'react';
import { WhatsappIcon, MessengerIcon } from './Icons';
import { contactConcierge, getPrimaryChannel, getSecondaryChannel } from '../order';
import { STORE_CONFIG } from '../data/store.config';

const ConciergeForm = () => {
    const formRef = useRef<HTMLFormElement | null>(null);

    const [formData, setFormData] = useState({
        model: '',
        budget: '',
        notes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const primary = getPrimaryChannel();
    const secondary = getSecondaryChannel();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        contactConcierge(
            { model: formData.model, budget: formData.budget, notes: formData.notes },
            primary
        );
    };

    const handleSecondary = () => {
        // Ensure required fields are filled even for the secondary channel.
        if (formRef.current && !formRef.current.reportValidity()) return;
        contactConcierge(
            { model: formData.model, budget: formData.budget, notes: formData.notes },
            secondary
        );
    };


    return (
        <div className="concierge-card">
            <div className="concierge-content">
                <h3 className="serif-text">{STORE_CONFIG.copy.ui.conciergeTitle}</h3>
                <p>لم تجدي القطعة التي تبحثين عنها؟ دعينا نبحث لكِ عنها في شبكتنا العالمية.</p>
                
                <form ref={formRef} onSubmit={handleSubmit} className="concierge-form">
                    <div className="form-group">
                        <label htmlFor="model-input">{STORE_CONFIG.copy.ui.conciergeModelLabel}</label>
                        <input 
                            id="model-input"
                            type="text" 
                            name="model" 
                            required 
                            placeholder={STORE_CONFIG.copy.ui.conciergeModelPlaceholder}
                            value={formData.model}
                            onChange={handleChange}
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="budget-input">{STORE_CONFIG.copy.ui.conciergeBudgetLabel}</label>
                        <select 
                            id="budget-input"
                            name="budget" 
                            value={formData.budget} 
                            onChange={handleChange} 
                            required
                        >
                            <option value="">{STORE_CONFIG.copy.ui.conciergeBudgetPlaceholder}</option>
                            <option value="أقل من 20,000">أقل من 20,000</option>
                            <option value="20,000 - 40,000">20,000 - 40,000</option>
                            <option value="40,000 - 60,000">40,000 - 60,000</option>
                            <option value="أكثر من 60,000">أكثر من 60,000</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="notes-input">{STORE_CONFIG.copy.ui.conciergeNotesLabel}</label>
                        <textarea 
                            id="notes-input"
                            name="notes" 
                            rows={2}
                            placeholder={STORE_CONFIG.copy.ui.conciergeNotesPlaceholder}
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">
                        {primary === 'whatsapp' ? <WhatsappIcon /> : <MessengerIcon />}
                        <span>{primary === 'whatsapp' ? STORE_CONFIG.copy.ui.conciergeSendViaWhatsApp : STORE_CONFIG.copy.ui.conciergeSendViaMessenger}</span>
                    </button>

                    <button type="button" onClick={handleSecondary} className="btn btn-secondary btn-full" style={{ marginTop: '10px' }}>
                        {secondary === 'whatsapp' ? <WhatsappIcon /> : <MessengerIcon />}
                        <span>{secondary === 'whatsapp' ? STORE_CONFIG.copy.ui.altWhatsApp : STORE_CONFIG.copy.ui.altMessenger}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ConciergeForm;
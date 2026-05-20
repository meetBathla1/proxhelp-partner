import React, { useState } from 'react';
import { Plus, Trash2, ListOrdered, FileText, MessageSquare } from 'lucide-react';

const AdminProductModal = ({ formData, setFormData, services }) => {
  const [activeTab, setActiveTab] = useState('basic');

  const handleArrayChange = (field, index, subfield, value) => {
    const newArr = [...(formData[field] || [])];
    newArr[index][subfield] = value;
    setFormData({ ...formData, [field]: newArr });
  };

  const addArrayItem = (field, emptyItem) => {
    setFormData({ ...formData, [field]: [...(formData[field] || []), emptyItem] });
  };

  const removeArrayItem = (field, index) => {
    const newArr = formData[field].filter((_, i) => i !== index);
    setFormData({ ...formData, [field]: newArr });
  };

  return (
    <div className="admin-product-modal-container" style={{ display: 'flex', gap: '20px', minHeight: '60vh' }}>
      {/* Sidebar Tabs */}
      <div style={{ width: '200px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '16px' }}>
        <button type="button" onClick={() => setActiveTab('basic')} style={tabStyle(activeTab === 'basic')}>Basic Info</button>
        <button type="button" onClick={() => setActiveTab('benefits')} style={tabStyle(activeTab === 'benefits')}>Benefits</button>
        <button type="button" onClick={() => setActiveTab('refer')} style={tabStyle(activeTab === 'refer')}>Whom to Refer</button>
        <button type="button" onClick={() => setActiveTab('steps')} style={tabStyle(activeTab === 'steps')}>How to Perform</button>
        <button type="button" onClick={() => setActiveTab('tc')} style={tabStyle(activeTab === 'tc')}>T&C</button>
        <button type="button" onClick={() => setActiveTab('faqs')} style={tabStyle(activeTab === 'faqs')}>FAQs</button>
      </div>

      {/* Content Area */}
      <div style={{ flex: 1, maxHeight: '65vh', overflowY: 'auto', paddingRight: '10px' }}>
        
        {activeTab === 'basic' && (
          <div className="form-grid">
            <div className="form-group">
              <label>Service Category</label>
              <select value={formData.service_id || ''} onChange={(e) => setFormData({ ...formData, service_id: e.target.value })} required>
                <option value="">Select Service</option>
                {services.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Product Name</label>
              <input type="text" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="form-group">
              <label>Bank Name</label>
              <input type="text" value={formData.bank_name || ''} onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Earn Amount</label>
              <input type="text" value={formData.earn_amount || ''} onChange={(e) => setFormData({ ...formData, earn_amount: e.target.value })} placeholder="e.g. 1500" />
            </div>
            <div className="form-group">
              <label>Logo URL (Square Icon)</label>
              <input type="text" value={formData.logo_url || ''} onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Product Banner URL (Top Header)</label>
              <input type="text" value={formData.product_banner || ''} onChange={(e) => setFormData({ ...formData, product_banner: e.target.value })} placeholder="https://..." />
            </div>
            <div className="form-group">
              <label>Joining Fee (₹)</label>
              <input type="text" value={formData.joining_fee || ''} onChange={(e) => setFormData({ ...formData, joining_fee: e.target.value })} placeholder="e.g. 0 or 499" />
            </div>
            <div className="form-group">
              <label>Renewal / Annual Fee (₹)</label>
              <input type="text" value={formData.renewal_fee || ''} onChange={(e) => setFormData({ ...formData, renewal_fee: e.target.value })} placeholder="e.g. 0 or 499" />
            </div>
            
            <div className="form-group full-width">
               <label>Stats Overview</label>
               <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="number" value={formData.stats?.earnings || 0} onChange={(e) => setFormData({...formData, stats: {...(formData.stats||{}), earnings: Number(e.target.value)}})} placeholder="Total Earnings" />
                  <input type="number" value={formData.stats?.leads || 0} onChange={(e) => setFormData({...formData, stats: {...(formData.stats||{}), leads: Number(e.target.value)}})} placeholder="Total Leads" />
                  <input type="number" value={formData.stats?.sales || 0} onChange={(e) => setFormData({...formData, stats: {...(formData.stats||{}), sales: Number(e.target.value)}})} placeholder="Total Sales" />
               </div>
            </div>

            <div className="form-group full-width">
              <label>Official Apply URL</label>
              <input type="url" value={formData.redirect_url || ''} onChange={(e) => setFormData({ ...formData, redirect_url: e.target.value })} />
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="is_featured" checked={!!formData.is_featured} onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked ? 1 : 0 })} style={{width:'auto'}} />
              <label htmlFor="is_featured" style={{margin:0}}>Show as Featured Product</label>
            </div>
            <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" id="is_active" checked={formData.is_active !== undefined ? !!formData.is_active : true} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked ? 1 : 0 })} style={{width:'auto'}} />
              <label htmlFor="is_active" style={{margin:0}}>Product Active</label>
            </div>
          </div>
        )}

        {activeTab === 'benefits' && (
          <div>
             <h3 style={{marginBottom:'10px'}}>Product Benefits</h3>
             {(formData.benefits || []).map((b, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" value={b.icon || '✔'} onChange={(e) => handleArrayChange('benefits', idx, 'icon', e.target.value)} style={{ width: '50px' }} />
                  <input type="text" value={b.title || ''} onChange={(e) => handleArrayChange('benefits', idx, 'title', e.target.value)} style={{ flex: 1 }} placeholder="Cashback benefit..." />
                  <input type="text" value={b.desc || ''} onChange={(e) => handleArrayChange('benefits', idx, 'desc', e.target.value)} style={{ flex: 2 }} placeholder="Detail description (optional)" />
                  <button type="button" onClick={() => removeArrayItem('benefits', idx)} style={{ padding: '0 8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px' }}><Trash2 size={16} /></button>
                </div>
             ))}
             <button type="button" onClick={() => addArrayItem('benefits', { icon: '✔', title: '', desc: '' })} style={addBtnStyle}><Plus size={14}/> Add Benefit</button>
          </div>
        )}

        {activeTab === 'refer' && (
          <div>
             <h3 style={{marginBottom:'10px'}}>Whom to Refer</h3>
             {(formData.whom_to_refer || []).map((w, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input type="text" value={w.title || ''} onChange={(e) => handleArrayChange('whom_to_refer', idx, 'title', e.target.value)} style={{ flex: 1 }} placeholder="E.g. Salaried Employees" />
                  <input type="text" value={w.subtitle || ''} onChange={(e) => handleArrayChange('whom_to_refer', idx, 'subtitle', e.target.value)} style={{ flex: 2 }} placeholder="Min income 25k/month" />
                  <button type="button" onClick={() => removeArrayItem('whom_to_refer', idx)} style={{ padding: '0 8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px' }}><Trash2 size={16} /></button>
                </div>
             ))}
             <button type="button" onClick={() => addArrayItem('whom_to_refer', { title: '', subtitle: '' })} style={addBtnStyle}><Plus size={14}/> Add Target Audience</button>
          </div>
        )}


        {activeTab === 'steps' && (
          <div>
             <h3 style={{marginBottom:'10px'}}>How to Perform (Steps)</h3>
             {(formData.how_to_perform_steps || []).map((s, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span style={{padding: '8px', background: '#e2e8f0', borderRadius: '4px'}}>{idx + 1}</span>
                  <input type="text" value={s.title || ''} onChange={(e) => handleArrayChange('how_to_perform_steps', idx, 'title', e.target.value)} style={{ flex: 1 }} placeholder="Step title" />
                  <input type="text" value={s.desc || ''} onChange={(e) => handleArrayChange('how_to_perform_steps', idx, 'desc', e.target.value)} style={{ flex: 2 }} placeholder="Step description" />
                  <button type="button" onClick={() => removeArrayItem('how_to_perform_steps', idx)} style={{ padding: '0 8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px' }}><Trash2 size={16} /></button>
                </div>
             ))}
             <button type="button" onClick={() => addArrayItem('how_to_perform_steps', { title: '', desc: '' })} style={addBtnStyle}><ListOrdered size={14}/> Add Step</button>
          </div>
        )}

        {activeTab === 'tc' && (
          <div>
             <h3 style={{marginBottom:'10px'}}>Terms & Conditions</h3>
             {(formData.terms_conditions || []).map((t, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexDirection: 'column', background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                  <div style={{display:'flex', gap: '8px'}}>
                    <input type="text" value={t.title || ''} onChange={(e) => handleArrayChange('terms_conditions', idx, 'title', e.target.value)} style={{ flex: 1 }} placeholder="Section Title (e.g. Eligibility)" />
                    <button type="button" onClick={() => removeArrayItem('terms_conditions', idx)} style={{ padding: '0 8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px' }}><Trash2 size={16} /></button>
                  </div>
                  <textarea value={t.content || ''} onChange={(e) => handleArrayChange('terms_conditions', idx, 'content', e.target.value)} placeholder="Terms content..." rows={3}></textarea>
                </div>
             ))}
             <button type="button" onClick={() => addArrayItem('terms_conditions', { title: '', content: '' })} style={addBtnStyle}><FileText size={14}/> Add T&C Section</button>
          </div>
        )}

        {activeTab === 'faqs' && (
          <div>
             <h3 style={{marginBottom:'10px'}}>FAQs</h3>
             {(formData.faqs || []).map((f, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexDirection: 'column', background: '#f8fafc', padding: '10px', borderRadius: '6px' }}>
                  <div style={{display:'flex', gap: '8px'}}>
                    <input type="text" value={f.q || ''} onChange={(e) => handleArrayChange('faqs', idx, 'q', e.target.value)} style={{ flex: 1 }} placeholder="Question?" />
                    <button type="button" onClick={() => removeArrayItem('faqs', idx)} style={{ padding: '0 8px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '4px' }}><Trash2 size={16} /></button>
                  </div>
                  <textarea value={f.a || ''} onChange={(e) => handleArrayChange('faqs', idx, 'a', e.target.value)} placeholder="Answer" rows={2}></textarea>
                </div>
             ))}
             <button type="button" onClick={() => addArrayItem('faqs', { q: '', a: '' })} style={addBtnStyle}><MessageSquare size={14}/> Add FAQ</button>
          </div>
        )}

      </div>
    </div>
  );
};

const tabStyle = (isActive) => ({
  padding: '10px 14px',
  textAlign: 'left',
  background: isActive ? '#f3e8ff' : 'transparent',
  color: isActive ? '#7c3aed' : '#64748b',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: isActive ? '600' : '500',
  transition: 'all 0.2s',
  display: 'block',
  width: '100%'
});

const addBtnStyle = {
  display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', marginTop: '10px'
};

export default AdminProductModal;

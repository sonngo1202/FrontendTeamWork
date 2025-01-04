import { useEffect, useRef, useState } from 'react';
import '../assets/css/Sort.css';

const Sort = ({ criteria, setCriteria, setClose }) => {
    const options = [
        { name: 'Priority Level', key: 'priorityLevel.level', order: 'asc', icon: 'fas fa-level-up-alt' },
        { name: 'Start date', key: 'startDate', order: 'asc', icon: 'fas fa-calendar-alt' },
        { name: 'End date', key: 'endDate', order: 'asc', icon: 'fas fa-calendar-alt' }
    ];
    const [filteredOptions, setFilteredOptions] = useState([]);
    const keyRef = useRef(null);
    const orderRef = useRef(null);
    const addSortRef = useRef(null);
    const [isOpenToAdd, setIsOpenToAdd] = useState(false);
    const [isOpenKey, setIsOpenKey] = useState(false);
    const [isOpenOrder, setIsOpenOrder] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useEffect(() => {
        const filtered = options.filter(option =>
            !criteria.some(item => item.key === option.key)
        );
        setFilteredOptions(filtered);
    }, [criteria, options]);

    function handleRemoveCriteria(e, option) {
        e.stopPropagation();
        let count = criteria.length - 1;
        const updatedCriteria = criteria.filter(item => item.key !== option.key);
        setCriteria(updatedCriteria);
        if (count === 0) {
            setClose(false);
        }
    }

    const handleAddCriteria = (option) => {
        if (!criteria.some(item => item.key === option.key)) {
            const updatedCriteria = [...criteria, option];
            setCriteria(updatedCriteria);
        }
        setClose(false);
    }

    const handleAddCriteriaCustom = (e, option) => {
        e.stopPropagation();
        if (!criteria.some(item => item.key === option.key)) {
            const updatedCriteria = [...criteria, option];
            setCriteria(updatedCriteria);
        }
        setIsOpenToAdd(false);
    }

    const handleClear = () => {
        setCriteria([]);
        setClose(false);
    }

    const handleChangeOrder = (e, selected, order) => {
        e.stopPropagation();
        const updatedCriteria = criteria.map(item => {
            if (item.key === selected.key) {
                return {
                    ...item,
                    order: order
                };
            }
            return item;
        });
        setCriteria(updatedCriteria);
        setIsOpenOrder(false);
    }

    const handleChangeKey = (e, selected, itemKey) => {
        e.stopPropagation();
        const updatedCriteria = criteria.map(item => {
            if (item.key === selected.key) {
                return {
                    ...item,
                    key: itemKey.key,
                    name: itemKey.name
                };
            }
            return item;
        });
        setCriteria(updatedCriteria);
        setIsOpenKey(false);
    }

    return (
        <div>
            {criteria.length <= 0 && <div className='sort-container-empty'>
                {options.map((item, index) => (
                    <div key={index} className='sort-empty-item' onClick={() => handleAddCriteria(item)}>
                        <i className={`${item.icon}`}></i>
                        <span>{item.name}</span>
                    </div>
                ))}
            </div>}
            {criteria.length > 0 && <div className='sort-container'>
                <div className='sort-header'>
                    <span>Sorts</span>
                    <button onClick={handleClear} >Clear</button>
                </div>
                <div className='sort-content'>
                    {criteria.map((item, index) => (
                        <div className='sort-content-item' key={index} onClick={() => setSelectedItem(item)}>
                            <div ref={keyRef} className={`item-sort-name ${isOpenKey && selectedItem?.key === item.key ? 'active' : ''}`} onClick={() => { setIsOpenKey(!isOpenKey); setIsOpenToAdd(false); setIsOpenOrder(false) }}>
                                <div className='item-sort-name-left'>
                                    <i className={`${item.icon}`}></i>
                                    <span>{item.name}</span>
                                </div>
                                <i className='fas fa-chevron-down'></i>
                                {isOpenKey && selectedItem?.key === item.key && (<div className='options-sort'>
                                    {filteredOptions.map((op, index) => (
                                        <div key={index} className='options-sort-item' onClick={(e) => handleChangeKey(e, item, op)}>
                                            <i className={`${op.icon}`}></i>
                                            <span>{op.name}</span>
                                        </div>
                                    ))}
                                </div>)}
                            </div>
                            <div ref={orderRef} className={`item-sort-order ${isOpenOrder && selectedItem?.key === item.key ? 'active' : ''}`} onClick={() => { setIsOpenOrder(!isOpenOrder); setIsOpenToAdd(false); setIsOpenKey(false) }}>
                                <div className='item-sort-oder-left'>
                                    <i className={`fas ${item.order === 'asc' ? 'fa-sort-amount-asc' : 'fa-sort-amount-desc'}`}></i>
                                    <span>{item.order === 'asc' ? 'Ascending' : 'Descending'}</span>
                                </div>
                                <i className='fas fa-chevron-down'></i>
                                {isOpenOrder && selectedItem?.key === item.key && (<div className='options-sort'>
                                    <div className='options-sort-item' onClick={(e) => handleChangeOrder(e, item, 'asc')}>
                                        <span>Ascending</span>
                                    </div>
                                    <div className='options-sort-item' onClick={(e) => handleChangeOrder(e, item, 'desc')}>
                                        <span>Descending</span>
                                    </div>
                                </div>)}
                            </div>
                            <i className='fas fa-times cancel' onClick={(e) => handleRemoveCriteria(e, item)}></i>
                        </div>
                    ))}
                </div>
                <div className='add-sort' ref={addSortRef}>
                    <button onClick={() => { setIsOpenToAdd(!isOpenToAdd); setIsOpenOrder(false); setIsOpenKey(false) }}>
                        <i className='fas fa-plus'></i>
                        <span>Add sort</span>
                    </button>
                    {isOpenToAdd && (<div className='options-sort'>
                        {filteredOptions.map((op, index) => (
                            <div key={index} className='options-sort-item' onClick={(e) => handleAddCriteriaCustom(e, op)}>
                                <i className={`${op.icon}`}></i>
                                <span>{op.name}</span>
                            </div>
                        ))}
                    </div>)}
                </div>
            </div>}
        </div>
    );
}
export default Sort;
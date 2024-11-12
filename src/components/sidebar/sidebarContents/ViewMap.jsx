import { useContext } from 'react';
import { EditContext } from '@pages/editMap/EditContext';

function ViewMap() {
	const {
		map,
		deleteMap,
		toggleSidebar,
	} = useContext(EditContext);

    return (
        <>
            <h2 className="title">{map.title}</h2>
            <dl>
                <dt>Description:</dt>
                <dd>
                    <p>{map.description || 'No description.'}</p>
                </dd>
                <dt>Author:</dt>
                <dd>
                    <p>{map.author || 'No Author.'}</p>
                </dd>
            </dl>
            <div className="sidebarActions">
                <button
                    onClick={() => {
                        toggleSidebar({
                            mode: 'edit',
                            event: null,
                        });
                    }}
                    className="green editMap">
                    Edit map
                </button>
                <button
                    onClick={() => {
                        if (
                            confirm(
                                'Are you sure you want to delete it? You will not be able to bring it back.'
                            )
                        ) {
                            deleteMap(map.mapId);
                        }
                    }}
                    className="red deleteMap">
                    Delete map
                </button>
            </div>
        </>
    );
}

export default ViewMap;

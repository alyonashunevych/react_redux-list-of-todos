import React, { useEffect, useState } from 'react';
import { Loader } from '../Loader';
import { getUser } from '../../api';
import { User } from '../../types/User';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { currentTodoSlice } from '../../features/currentTodo';
import { Todo } from '../../types/Todo';

export const TodoModal: React.FC = () => {
  const currentTodo = useAppSelector(state => state.currentTodo) as Todo;
  const dispatch = useAppDispatch();

  const [user, setUser] = useState<User | null>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser(currentTodo.userId)
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [currentTodo]);

  const handleResetCurrentTodo = () => {
    dispatch(currentTodoSlice.actions.reset());
  };

  return (
    <div className="modal is-active" data-cy="modal">
      <div className="modal-background" />

      {loading ? (
        <Loader />
      ) : (
        <div className="modal-card">
          <header className="modal-card-head">
            <div
              className="modal-card-title has-text-weight-medium"
              data-cy="modal-header"
            >
              Todo #{currentTodo.id}
            </div>

            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className="delete"
              data-cy="modal-close"
              onClick={handleResetCurrentTodo}
            />
          </header>

          <div className="modal-card-body">
            <p className="block" data-cy="modal-title">
              {currentTodo.title}
            </p>

            <p className="block" data-cy="modal-user">
              {currentTodo.completed ? (
                <strong className="has-text-success">Done</strong>
              ) : (
                <strong className="has-text-danger">Planned</strong>
              )}

              {' by '}

              <a href={`mailto:${user?.email}`}>{user?.name}</a>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

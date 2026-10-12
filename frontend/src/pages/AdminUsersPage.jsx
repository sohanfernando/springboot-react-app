import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, PageHeading, Table, Row, Cell, Loading, Input } from '../components/admin/AdminUI';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      try {
        const res = await axios.get('/users');
        if (!cancelled) setUsers(Array.isArray(res.data) ? res.data : []);
      } catch {
        if (!cancelled) setUsers([]);
      }
      if (!cancelled) setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const q = search.trim().toLowerCase();
  const visible = q
    ? users.filter((u) =>
        [u.name, u.email, u.role, u.city].filter(Boolean).join(' ').toLowerCase().includes(q)
      )
    : users;

  return (
    <>
      <PageHeading
        eyebrow="People"
        title="Customers"
        meta={loading ? 'Loading' : `${visible.length} of ${users.length} accounts`}
      >
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search name, email, role"
          className="w-64"
        />
        <Link
          to="/admin-signup"
          className="text-[11px] tracking-label uppercase text-black border-b border-black pb-0.5 whitespace-nowrap"
        >
          Add administrator
        </Link>
      </PageHeading>

      {loading ? (
        <Card><Loading label="Loading customers" /></Card>
      ) : (
        <Table
          headers={['ID', 'Name', 'Email', 'Role', 'Location']}
          empty={q ? `Nothing matches "${search}".` : 'No accounts yet.'}
        >
          {visible.map((user) => (
            <Row key={user.id}>
              <Cell className="tabular-nums text-black/40">{user.id}</Cell>
              <Cell className="text-black">{user.name || '—'}</Cell>
              <Cell className="text-black/60">{user.email}</Cell>
              <Cell>
                <span className="text-[10px] tracking-label uppercase border border-line px-2 py-1 text-black/55">
                  {user.role || 'USER'}
                </span>
              </Cell>
              <Cell className="text-black/50">
                {[user.city, user.postalCode].filter(Boolean).join(' ') || '—'}
              </Cell>
            </Row>
          ))}
        </Table>
      )}
    </>
  );
};

export default AdminUsersPage;

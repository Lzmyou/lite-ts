import { opentracing } from 'jaeger-client';

import { JaegerUnitOfWork as Self } from './unit-of-work';
import { Mock } from '..';
import { UnitOfWorkRepositoryBase } from '../..';

class TestUnitOfWorkModel { }

describe('src/service/jaeger/unit-of-work.ts', () => {
    describe('.commit()', () => {
        it('ok', async () => {
            const mockUow = new Mock<UnitOfWorkRepositoryBase>();
            const self = new Self(mockUow.actual, null);

            const mockSpan = new Mock<opentracing.Span>();
            Reflect.set(self, 'm_Span', mockSpan.actual);

            mockSpan.expected.setTag(opentracing.Tags.DB_STATEMENT, 'commit');

            mockUow.expected.commit();

            mockSpan.expected.log({});

            mockSpan.expected.finish();

            await self.commit();
        });
    });

    describe('.registerAdd(table: string, entry: any)', () => {
        it('ok', () => {
            const mockUow = new Mock<UnitOfWorkRepositoryBase>();
            const self = new Self(mockUow.actual, null);

            mockUow.expected.registerAdd(TestUnitOfWorkModel, {});

            self.registerAdd(TestUnitOfWorkModel, {});
        });
    });

    describe('.registerRemove(table: string, entry: any)', () => {
        it('ok', () => {
            const mockUow = new Mock<UnitOfWorkRepositoryBase>();
            const self = new Self(mockUow.actual, null);

            mockUow.expected.registerRemove(TestUnitOfWorkModel, {});

            self.registerRemove(TestUnitOfWorkModel, {});
        });
    });

    describe('.registerSave(table: string, entry: any)', () => {
        it('ok', () => {
            const mockUow = new Mock<UnitOfWorkRepositoryBase>();
            const self = new Self(mockUow.actual, null);

            mockUow.expected.registerSave(TestUnitOfWorkModel, {});

            self.registerSave(TestUnitOfWorkModel, {});
        });
    });
});
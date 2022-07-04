import { deepStrictEqual, strictEqual } from 'assert';

import { DbUserValueService as Self } from './user-value-service';
import { Mock } from '../assert';
import { IRewardData, ITargetValueService, IUnitOfWork, IUserService, IValueData, NowTimeBase } from '../../contract';
import { enum_, global } from '../../model';

describe('src/service/user/value-service.ts', () => {
    describe('.checkConditions(uow: IUnitOfWork, conditions: IValueConditionData[][])', () => {
        it('ok', async () => {
            const mockUserService = new Mock<IUserService>();
            const self = new Self(mockUserService.actual, 0, null, null, null, null, null);

            const mockValueService = new Mock<ITargetValueService<global.UserValue>>();
            mockUserService.expectReturn(
                r => r.getTargetValueService(3, 2),
                mockValueService.actual
            );

            mockValueService.expectReturn(
                r => r.checkConditions(null, [
                    [{
                        count: 1,
                        op: enum_.RelationOperator.eq,
                        source: 'a',
                        targetNo: 3,
                        targetType: 2,
                        valueType: 4
                    }, {
                        count: 1,
                        op: enum_.RelationOperator.eq,
                        source: 'b',
                        targetNo: 3,
                        targetType: 2,
                        valueType: 4
                    }]
                ]),
                true
            );

            mockUserService.expectReturn(
                r => r.getTargetValueService(6, 2),
                mockValueService.actual
            );

            mockValueService.expectReturn(
                r => r.checkConditions(null, [
                    [{
                        count: 1,
                        op: enum_.RelationOperator.eq,
                        source: 'c',
                        targetNo: 6,
                        targetType: 2,
                        valueType: 4
                    }]
                ]),
                true
            );

            const res = await self.checkConditions(null, [
                [{
                    count: 1,
                    op: enum_.RelationOperator.eq,
                    source: 'a',
                    targetType: 2,
                    targetNo: 3,
                    valueType: 4
                }, {
                    count: 1,
                    op: enum_.RelationOperator.eq,
                    source: 'b',
                    targetNo: 3,
                    targetType: 2,
                    valueType: 4
                }, {
                    count: 1,
                    op: enum_.RelationOperator.eq,
                    source: 'c',
                    targetNo: 6,
                    targetType: 2,
                    valueType: 4
                }]
            ]);
            strictEqual(res, true);
        });
    });

    describe('.getNow(uow: IUnitOfWork)', () => {
        it('数值', async () => {
            const self = new Self(null, 1, null, null, null, null, null);

            const mockUow = new Mock<IUnitOfWork>();
            Reflect.set(self, 'getCount', (arg: IUnitOfWork, arg1: number) => {
                strictEqual(arg, mockUow.actual);
                strictEqual(arg1, 1);
                return 11;
            });

            const res = await self.getNow(mockUow.actual);
            strictEqual(res, 11);
        });

        it('NowTime', async () => {
            const mockNowTime = new Mock<NowTimeBase>();
            const self = new Self(null, 1, null, null, mockNowTime.actual, null, null);

            const mockUow = new Mock<IUnitOfWork>();
            Reflect.set(self, 'getCount', (arg: IUnitOfWork, arg1: number) => {
                strictEqual(arg, mockUow.actual);
                strictEqual(arg1, 1);
                return 0;
            });

            mockNowTime.expectReturn(
                r => r.unix(),
                99
            );

            const res = await self.getNow(mockUow.actual);
            strictEqual(res, 99);
        });
    });

    describe('.update(uow: IUnitOfWork, values: IValueData[])', () => {
        it('ok', async () => {
            const mockUserService = new Mock<IUserService>();
            const self = new Self(mockUserService.actual, 0, null, null, null, null, null);

            const mockValueService = new Mock<ITargetValueService<global.UserValue>>();
            mockUserService.expectReturn(
                r => r.getTargetValueService(3, 2),
                mockValueService.actual
            );

            mockValueService.expected.update(null, [{
                count: 1,
                source: 'a',
                targetNo: 3,
                targetType: 2,
                valueType: 4
            }, {
                count: 2,
                source: 'b',
                targetNo: 3,
                targetType: 2,
                valueType: 5
            }]);

            mockUserService.expectReturn(
                r => r.getTargetValueService(4, 2),
                mockValueService.actual
            );

            mockValueService.expected.update(null, [{
                count: 3,
                source: 'c',
                targetNo: 4,
                targetType: 2,
                valueType: 6
            }]);

            await self.update(null, [{
                count: 1,
                source: 'a',
                targetNo: 3,
                targetType: 2,
                valueType: 4
            }, {
                count: 2,
                source: 'b',
                targetNo: 3,
                targetType: 2,
                valueType: 5
            }, {
                count: 3,
                source: 'c',
                targetNo: 4,
                targetType: 2,
                valueType: 6
            }]);
        });
    });

    describe('.updateByRewards(uow: IUnitOfWork, rewards: IRewardData[][], source: string)', () => {
        it('', async () => {
            const userID = 'user-id';
            const self = new Self({
                userID: userID
            } as IUserService, 0, null, null, null, null, null);

            const source = 'test';
            const rewards = [
                [{
                    count: 11,
                    valueType: 1
                }],
                [{
                    count: 22,
                    valueType: 2,
                    weight: 999
                }, {
                    count: 222,
                    valueType: 2,
                    weight: 1
                }]
            ] as IRewardData[][];
            const expectRes = [{
                count: 11,
                source: source,
                valueType: 1
            }, {
                count: 22,
                source: source,
                valueType: 2
            }];
            Reflect.set(self, 'update', (arg: IUnitOfWork, arg1: IValueData[]) => {
                deepStrictEqual(
                    [arg, arg1],
                    [
                        null,
                        expectRes
                    ]
                )
            });

            const res = await self.updateByRewards(null, source, rewards);
            deepStrictEqual(res, expectRes);
        });
    });
});